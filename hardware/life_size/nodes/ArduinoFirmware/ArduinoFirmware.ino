// Basic algorithm idea: Parent nodes announce themselves. When a node sees the
// announcement of a parent, it creates a pair with the announcing node and
// itself and sends that via SPI.

// Pins on 328P:
//
//   * 10: SS (slave select)
//
//   * 11: MOSI (master out, slave in)
//
//   * 12: MISO (not used here)
//
//   * 13: SCK (clock)

#include <SPI.h>
#include <Adafruit_NeoPixel.h>

#include "id.h" // ID of this node, e.g.: `#define ID A` (no quotes!)

#include "util.h"
#include "settings.h"
#include "TransceiverOnPort.h"
#include "Port.h"
#include "Pair.h"
#include "message.h"
#include "pairMessageQueue.h"

Adafruit_NeoPixel neoPixel;

constexpr char idOfThisNode = TOSTRING(ID)[0];
static TransceiverOnPort<rxPinNumberOfPort1, txPinNumberOfPort1, 1>
  transceiverOnPort1;
static TransceiverOnPort<rxPinNumberOfPort2, txPinNumberOfPort2, 2>
  transceiverOnPort2;
static TransceiverOnPort<rxPinNumberOfPort3, txPinNumberOfPort3, 3>
  transceiverOnPort3;
static TransceiverOnPort<rxPinNumberOfPort4, txPinNumberOfPort4, 4>
  transceiverOnPort4;
static uint8_t numberOfPortWithParent = 0; // 0 = no parent, unless node ID is A
                                           // (A is always connected to root)

static uint32_t parentExpiryTime = 0; // ms

ISR(TIMER2_COMPA_vect) {
  transceiverOnPort1.transceiver.handleTimer2Interrupt();
  transceiverOnPort2.transceiver.handleTimer2Interrupt();
  transceiverOnPort3.transceiver.handleTimer2Interrupt();
  transceiverOnPort4.transceiver.handleTimer2Interrupt();
}

ISR(PCINT2_vect) { // D0-D7
  transceiverOnPort1.transceiver.handlePinChangeInterrupt();
  transceiverOnPort2.transceiver.handlePinChangeInterrupt();
}

ISR(PCINT0_vect) { // D8-D13
  transceiverOnPort3.transceiver.handlePinChangeInterrupt();
  transceiverOnPort4.transceiver.handlePinChangeInterrupt();
}

uint8_t adjustForBrightness(uint8_t subColor) {
  return uint32_t(subColor) * ledBrightness / 0xff;
}

uint32_t neoPixelColor(const byte * const color) {
  return neoPixel.Color(
    adjustForBrightness(color[0]),
    adjustForBrightness(color[1]),
    adjustForBrightness(color[2])
  );
}

uint8_t listIndexFromIdOfThisNode() {
  return thisNodeIsRoot()
    ? 0
    : (idOfThisNode - 0x40);
}

void ledSetup() {
  const uint8_t numberOfLeds = 4;
  const uint8_t listIndex = listIndexFromIdOfThisNode();
  const uint8_t dataPin = ledDataPin;
  const byte * const * const nodeColors = nodeColorsList[listIndex];
  const uint32_t colorOfTopHemisphere = neoPixelColor(nodeColors[0]);
  const uint32_t colorOfBottomHemisphere = neoPixelColor(nodeColors[1]);

  neoPixel = Adafruit_NeoPixel(numberOfLeds, dataPin,
                               NEO_RGB + NEO_KHZ800);
  neoPixel.begin();
  neoPixel.setPixelColor(0, colorOfTopHemisphere);
  neoPixel.setPixelColor(1, colorOfTopHemisphere);
  neoPixel.setPixelColor(2, colorOfBottomHemisphere);
  neoPixel.setPixelColor(3, colorOfBottomHemisphere);
  neoPixel.show();
}

// During boot, the ESP-EYE CLK pin needs to be kept high (unless unconnected).
void waitForEspToBoot() {
  pinMode(A7, OUTPUT);
  digitalWrite(A7, LOW);
  pinMode(10, OUTPUT);
  digitalWrite(10, HIGH);
  pinMode(11, OUTPUT);
  digitalWrite(11, HIGH);
  pinMode(12, INPUT_PULLUP);
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  delay(bootDelay);
}

void setup() {
#if 0 // TODO: just for testing if IR LED lights up (behind 100 Ω resistor)
  pinMode(A0, OUTPUT);
  digitalWrite(A0, HIGH);
  delay(100000);
#endif

  waitForEspToBoot();

  SPI.begin();
  SPI.setDataMode(SPI_MODE3);

  ledSetup();

  Serial.begin(115200);

  setupMultiTransceiver();
}

bool iHaveAParent() {
  if (idOfThisNode == 'A') { // A is always connected to root
    return true;
  } else {
    return numberOfPortWithParent != 0;
  }
}

void sendViaSpi(char *message) {
  digitalWrite(SS, LOW);

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 4; j++) {
      char c = message[j];
      SPI.transfer(c);
    }
  }
  SPI.transfer('\0');

  digitalWrite(SS, HIGH);
}

void sendMyIdViaSpi() {
  // With DMA enabled, the ESP32 SPI driver wants to receive multiples of 32
  // bits:
  const char message[] = {'I', 'D', '=', idOfThisNode, '\0'};

  sendViaSpi(message);

  Serial.println(message); // TODO
}

void periodicallySendMyIdViaSpi() {
  static uint32_t scheduledSendTime = millis() + idSendPeriod; // ms
  uint32_t now = millis(); // ms

  if (now >= scheduledSendTime) {
    sendMyIdViaSpi();
    scheduledSendTime = now + idSendPeriod;
  }
}

void parseMessages() {
  bool messageHasBeenReceived;

  do {
    messageHasBeenReceived = false;
    messageHasBeenReceived |= 
      parseMessage(transceiverOnPort1, transceiverOnPort1.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort2, transceiverOnPort2.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort3, transceiverOnPort3.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort4, transceiverOnPort4.getMessage());
  } while (messageHasBeenReceived);
}

void sendPairViaSpi(const Pair &pair) {
  char message[] = {
                    pair.parentPort.nodeId,
                    charFromDigit(pair.parentPort.portNumber),
                    pair.childPort.nodeId,
                    charFromDigit(pair.childPort.portNumber),
                    '\0'
  };
  sendViaSpi(message);
  Serial.println(message);
}

void loop() {
  periodicallySendMyIdViaSpi();
  parseMessages();
  periodicallyAnnounceMe();
  removeParentIfExpired();
}

bool transmissionToParentIsInProgress() {
  if (numberOfPortWithParent == transceiverOnPort1.portNumber) {
    return transceiverOnPort1.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort2.portNumber) {
    return transceiverOnPort2.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort3.portNumber) {
    return transceiverOnPort3.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort4.portNumber) {
    return transceiverOnPort4.transceiver.transmissionIsInProgress();
  }
  return false;
}

void removeParent() {
  numberOfPortWithParent = 0;
}

void removeParentIfExpired() {
  if (iHaveAParent() && millis() > parentExpiryTime) {
    removeParent();
  }
}

void periodicallyAnnounceMe() {
  static uint32_t scheduledAnnouncementTime =
    millis() + announcementPeriod; // ms
  uint32_t now = millis(); // ms

  if (now >= scheduledAnnouncementTime) {
    announceMeToChildren();
    scheduledAnnouncementTime = now + announcementPeriod;
  }
}

static inline uint8_t digitFromChar(char c) {
  return c - 48;
}

static inline char charFromDigit(uint8_t digit) {
  return digit + 48;
}

static inline bool thisNodeIsRoot() {
  return idOfThisNode == '^';
}

template <typename T>
void sendPairMessageToParent(T &transceiverOnPort, const byte *pairMessage) {
  transceiverOnPort.transceiver.startTransmissionOfBytes(pairMessage,
                                                         pairMessageSize);
}

void enablePinChangeInterrupts() {
  PCICR |= // Pin Change Interrupt Control Register
    bit(PCIE2) | // D0 to D7
    bit(PCIE0); // D8 to D15
}

void setupMultiTransceiver() {
  multiTransceiver.startTimer1();
  multiTransceiver.startTimer2();
  enablePinChangeInterrupts();
  transceiverOnPort1.transceiver.begin();
  transceiverOnPort2.transceiver.begin();
  transceiverOnPort3.transceiver.begin();
  transceiverOnPort4.transceiver.begin();
}

template <typename T>
void transmitAnnouncement(T &transceiverOnPort) {
  transceiverOnPort.transceiver.startTransmissionOfBytes(
    buildAnnouncementMessage({idOfThisNode, transceiverOnPort.portNumber}),
    announcementMessageSize
  );
}

template <typename T>
void announceMeToChild(T &transceiverOnPort) {
  if (transceiverOnPort.portNumber == numberOfPortWithParent) {
    return;
  }
  transmitAnnouncement(transceiverOnPort);
}

void resetParentExpiryTime() {
  parentExpiryTime = millis() + parentExpiryDuration; // ms
}

template <typename T>
void parseAnnouncementMessage(T &transceiverOnPort, const byte *message) {
  if (thisNodeIsRoot()) {
    return; // root cannot have a parent => ignore announcement
  }

  if (!iHaveAParent()) {
    numberOfPortWithParent = transceiverOnPort.portNumber;
  }

  if (transceiverOnPort.portNumber == numberOfPortWithParent) {
    resetParentExpiryTime(); // call regularly to keep parent fresh
  }

  // Create pair, either describing a parent-child relationship or a loop:
  Port port = decodePort(message[1]);
  Pair pair;
  pair.parentPort = port;
  pair.childPort = {idOfThisNode, transceiverOnPort.portNumber};

  sendPairViaSpi(pair);
}

static inline Pair pairFromPairMessage(const byte *message) {
  Pair pair;
  pair.parentPort = decodePort(message[1]);
  pair.childPort = decodePort(message[2]);
  return pair;
}

template <typename T>
bool parseMessage(T &transceiverOnPort, byte *message) {
  if (message == 0) {
    return false;
  }

  if (message[0] & B01000000) {
    // pair message, ignore (not needed in this version)
    return true;
  } else {
    // announcement message
    parseAnnouncementMessage(transceiverOnPort, message);
    return true;
  }
  return false;
}

void sendPairMessageToParent(const byte *pairMessage) {
  if (numberOfPortWithParent == transceiverOnPort1.portNumber) {
    sendPairMessageToParent(transceiverOnPort1, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort2.portNumber) {
    sendPairMessageToParent(transceiverOnPort2, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort3.portNumber) {
    sendPairMessageToParent(transceiverOnPort3, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort4.portNumber) {
    sendPairMessageToParent(transceiverOnPort4, pairMessage);
  }
}

void announceMeToChildren() {
  announceMeToChild(transceiverOnPort1);
  if (!thisNodeIsRoot()) {
    announceMeToChild(transceiverOnPort2);
    announceMeToChild(transceiverOnPort3);
    announceMeToChild(transceiverOnPort4);
  }
}
