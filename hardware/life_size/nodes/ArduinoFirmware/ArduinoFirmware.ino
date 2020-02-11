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

#include "id.h" // ID of this node, e.g.: `#define ID A` (no quotes!)
#include "idUtil.h"

#include "settings.h"
#include "TransceiverOnPort.h"
#include "Port.h"
#include "Pair.h"
#include "message.h"
#include "pairMessageQueue.h"
#include "spiTransfer.h"
#include "leds.h"

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

void serialSetup() {
  Serial.begin(115200);
}

void setup() {
  waitForEspToBoot();

  spiTransferSetup();
  ledsSetup();
  serialSetup();
  multiTransceiverSetup();
}

bool iHaveAParent() {
  if (idOfThisNode == 'A') { // A is always connected to root
    return true;
  } else {
    return numberOfPortWithParent != 0;
  }
}

void parseSpiRxBuffer() {
  if (spiRxBuffer[0] != 'C') {
    return;
  }

  char buf[81];
  byte *compressedColors = spiRxBuffer + 1;
  byte *c = compressedColors;
  sprintf(buf, "Colors: %d, %d, %d, %d", c[0], c[1], c[2], c[3]);
  updateLedColors(compressedColors);
  Serial.println(buf);
}

void sendMyIdViaSpi() {
  clearSpiTxBuffer();
  spiTxBuffer[0] = 'I';
  spiTxBuffer[1] = 'D';
  spiTxBuffer[2] = '=';
  spiTxBuffer[3] = idOfThisNode;
  doSpiTransfer();
  parseSpiRxBuffer();
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
  clearSpiTxBuffer();
  spiTxBuffer[0] = pair.parentPort.nodeId;
  spiTxBuffer[1] = charFromDigit(pair.parentPort.portNumber);
  spiTxBuffer[2] = pair.childPort.nodeId;
  spiTxBuffer[3] = charFromDigit(pair.childPort.portNumber);
  doSpiTransfer();
  parseSpiRxBuffer();
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

void multiTransceiverSetup() {
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
