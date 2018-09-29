// Tested with Arduino Pro Mini

// Basic algorithm idea: Parent nodes announce themselves. When a node
// sees the announcement of a parent, it creates a pair with the
// announcing node and itself. Pairs are propagated up to the root
// node.

#include <EEPROM.h>
#include <Adafruit_NeoPixel.h>
#include "settings.h"
#include "PortPin.h"
#include "Port.h"
#include "Pair.h"
#include "pairMessageQueue.h"

Adafruit_NeoPixel neoPixel;

static char nodeId; // TODO: maybe rename to idOfThisNode

const uint8_t pinNumber1 = 2;
const uint8_t pinNumber2 = 3;
const uint8_t pinNumber3 = 8;
const uint8_t pinNumber4 = 9;
static PortPin<pinNumber1> portPin1(1);
static PortPin<pinNumber2> portPin2(2);
static PortPin<pinNumber3> portPin3(3);
static PortPin<pinNumber4> portPin4(4);
static uint8_t numberOfPortWithParent = 0; // 0 = no parent

static uint32_t parentExpiryTime = 0; // ms

ISR(TIMER2_COMPA_vect) {
  portPin1.transceiver.handleTimer2Interrupt();
  portPin2.transceiver.handleTimer2Interrupt();
  portPin3.transceiver.handleTimer2Interrupt();
  portPin4.transceiver.handleTimer2Interrupt();
}

ISR(PCINT2_vect) { // D0-D7
  portPin1.transceiver.handlePinChangeInterrupt();
  portPin2.transceiver.handlePinChangeInterrupt();
}

ISR(PCINT0_vect) { // D8-D13
  portPin3.transceiver.handlePinChangeInterrupt();
  portPin4.transceiver.handlePinChangeInterrupt();
}

uint8_t adjustForBrightness(uint8_t subColor) {
  return uint32_t(subColor) * ledBrightness / 0xff;
}

uint32_t neoPixelColor(uint8_t *color) {
  return neoPixel.Color(
    adjustForBrightness(color[0]),
    adjustForBrightness(color[1]),
    adjustForBrightness(color[2])
  );
}

void setupColors() {
  uint8_t color1[3] = {EEPROM.read(1), EEPROM.read(2), EEPROM.read(3)};
  uint8_t color2[3] = {EEPROM.read(4), EEPROM.read(5), EEPROM.read(6)};

  const uint8_t numberOfLeds = 4;
  const uint8_t dataPin = A0;
  neoPixel = Adafruit_NeoPixel(numberOfLeds, dataPin, NEO_RGB + NEO_KHZ800);
  neoPixel.begin();
  neoPixel.setPixelColor(0, neoPixelColor(color1));
  neoPixel.setPixelColor(1, neoPixelColor(color2));
  neoPixel.setPixelColor(2, neoPixelColor(color1));
  neoPixel.setPixelColor(3, neoPixelColor(color2));
  neoPixel.show();
}

void setup() {
  setupColors();

  nodeId = EEPROM.read(0);

  pinMode(ledPin, OUTPUT);
  flashLed();

  if (iAmRoot()) {
    Serial.begin(115200);
  }

  setupMultiTransceiver();
}

bool iHaveAParent() {
  return numberOfPortWithParent != 0;
}

void loop() {
  if (iAmRoot()) {
    rootLoop();
  } else {
    nonRootLoop();
  }
}

void printPair(const Pair &pair) {
  char buffer[] = {
                   pair.firstNode.nodeId,
                   charFromDigit(pair.firstNode.portNumber),
                   pair.secondNode.nodeId,
                   charFromDigit(pair.secondNode.portNumber),
                   '\0'
  };

  Serial.println(buffer);
}

void rootLoop() {
  parseMessage(portPin1, portPin1.getMessage());

  if (numberOfQueuedPairMessages() > 0) {
    const char *pairMessage = dequeuePairMessage();
    Pair pair = pairFromPairMessage(pairMessage);
    printPair(pair);
  }

  periodicallyAnnounceMe();
}

void parseMessages() {
  bool messageHasBeenReceived;

  do {
    messageHasBeenReceived = false;
    messageHasBeenReceived |= parseMessage(portPin1, portPin1.getMessage());
    messageHasBeenReceived |= parseMessage(portPin2, portPin2.getMessage());
    messageHasBeenReceived |= parseMessage(portPin3, portPin3.getMessage());
    messageHasBeenReceived |= parseMessage(portPin4, portPin4.getMessage());
  } while (messageHasBeenReceived);
}

void nonRootLoop() {
  parseMessages();

  if (!iHaveAParent()) {
    clearPairMessageQueue();
    return;
  }

  if (!transmissionToParentIsInProgress()) {
    if (numberOfQueuedPairMessages() > 0) {
      sendPairMessageToParent(dequeuePairMessage());
    }
  }
  periodicallyAnnounceMe();
  removeParentIfExpired();
}

bool transmissionToParentIsInProgress() {
  if (numberOfPortWithParent == portPin1.number) {
    return portPin1.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == portPin2.number) {
    return portPin2.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == portPin3.number) {
    return portPin3.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == portPin4.number) {
    return portPin4.transceiver.transmissionIsInProgress();
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

static void flashLed() {
  if (flashLedIsEnabled) {
    digitalWrite(ledPin, HIGH);
    delay(50);
    digitalWrite(ledPin, LOW);
    delay(50);
  }
}

static inline bool iAmRoot() {
  return nodeId == '*';
}

static inline bool startsRequest(char c) {
  return c == '!';
}

template <typename T>
Port I(T &portPin) {
  Port port;
  port.nodeId = nodeId;
  port.portNumber = portPin.number;
  return port;
}

// TODO: maybe create separate communication protocol file, or move to Port.h
char encodePort(char nodeId, uint8_t portNumber) {
  uint8_t encodedNodeId = nodeId == '*' ?
    1 : // != 0, because otherwise encoding for *1 would be '\0'
    nodeId - 0x3f; // A -> B00010, B -> B00011, ...
  uint8_t encodedPortNumber =
    portNumber - 1; // 1 -> B00, 2 -> B01, ...
  return encodedNodeId << 2 | encodedPortNumber;
}

template <typename T>
void sendPairMessageToParent(T &portPin, const char *pairMessage) {
  portPin.transceiver.startTransmissionOfCharacters(pairMessage);
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
  portPin1.transceiver.begin();
  portPin2.transceiver.begin();
  portPin3.transceiver.begin();
  portPin4.transceiver.begin();
}

template <typename T>
void transmitAnnouncement(T &portPin) {
  char buffer[] = {'!',
                   encodePort(nodeId, portPin.number), // TODO: pass port
                   '\0'};
  portPin.transceiver.startTransmissionOfCharacters(buffer);
}

template <typename T>
void announceMeToChild(T &portPin) {
  if (portPin.number == numberOfPortWithParent) {
    return;
  }
  transmitAnnouncement(portPin);
  flashLed();
}

void resetParentExpiryTime() {
  parentExpiryTime = millis() + parentExpiryDuration; // ms
}

template <typename T>
void parseAnnouncementMessage(T &portPin, const char *message) {
  if (iAmRoot()) {
    return; // root cannot have a parent => ignore announcement
  }

  if (!iHaveAParent()) {
    numberOfPortWithParent = portPin.number;
  }

  if (portPin.number == numberOfPortWithParent) {
    resetParentExpiryTime(); // call regularly to keep parent fresh
  }

  // Create pair, either describing parent-child (I) relationship, or
  // loop:
  Port port = portFromPayload(message[1]); // TODO: -> decodePort
  Pair pair;
  pair.firstNode = port;
  pair.secondNode = I(portPin);
  enqueuePairMessage(buildPairMessage(pair));
}

char *buildPairMessage(Pair pair) {
  static char pairMessage[4];
  pairMessage[0] = '%';
  pairMessage[1] = encodePort(pair.firstNode.nodeId,
                              pair.firstNode.portNumber);
  pairMessage[2] = encodePort(pair.secondNode.nodeId,
                              pair.secondNode.portNumber);
  pairMessage[3] = '\0';
  return pairMessage;
}

static inline Pair pairFromPairMessage(const char *message) {
  Pair pair;
  pair.firstNode = portFromPayload(message[1]);
  pair.secondNode = portFromPayload(message[2]);
  return pair;
}

template <typename T>
bool parseMessage(T &portPin, char *message) {
  if (message == 0) {
    return false;
  }
  switch (message[0]) {
  case '!':
    parseAnnouncementMessage(portPin, message);
    return true;
  case '%':
    enqueuePairMessage(message);
    return true;
  }
  return false;
}

void sendPairMessageToParent(const char *pairMessage) {
  if (numberOfPortWithParent == portPin1.number) {
    sendPairMessageToParent(portPin1, pairMessage);
  } else if (numberOfPortWithParent == portPin2.number) {
    sendPairMessageToParent(portPin2, pairMessage);
  } else if (numberOfPortWithParent == portPin3.number) {
    sendPairMessageToParent(portPin3, pairMessage);
  } else if (numberOfPortWithParent == portPin4.number) {
    sendPairMessageToParent(portPin4, pairMessage);
  }
}

void announceMeToChildren() {
  announceMeToChild(portPin1);
  if (!iAmRoot()) {
    announceMeToChild(portPin2);
    announceMeToChild(portPin3);
    announceMeToChild(portPin4);
  }
}
