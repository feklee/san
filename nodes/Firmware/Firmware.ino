// Tested with Arduino Pro Mini

// Basic algorithm idea: Parent nodes announce themselves. When a node
// sees the announcement of a parent, it creates a pair with the
// announcing node and itself. Pairs are propagated up to the root
// node.

#include <EEPROM.h>
#include <Adafruit_NeoPixel.h>
#include "settings.h"
#include "Port.h"
#include "OtherNode.h"
#include "Pair.h"
#include "pairMessageQueue.h"

Adafruit_NeoPixel neoPixel;

static char nodeId; // TODO: maybe rename to idOfThisNode

const uint8_t pinNumber1 = 2;
const uint8_t pinNumber2 = 3;
const uint8_t pinNumber3 = 8;
const uint8_t pinNumber4 = 9;
static Port<pinNumber1> port1(1);
static Port<pinNumber2> port2(2);
static Port<pinNumber3> port3(3);
static Port<pinNumber4> port4(4);
static uint8_t numberOfPortWithParent = 0; // 0 = no parent

static uint32_t parentExpiryTime = 0; // ms

ISR(TIMER2_COMPA_vect) {
  port1.transceiver.handleTimer2Interrupt();
  port2.transceiver.handleTimer2Interrupt();
  port3.transceiver.handleTimer2Interrupt();
  port4.transceiver.handleTimer2Interrupt();
}

ISR(PCINT2_vect) { // D0-D7
  port1.transceiver.handlePinChangeInterrupt();
  port2.transceiver.handlePinChangeInterrupt();
}

ISR(PCINT0_vect) { // D8-D13
  port3.transceiver.handlePinChangeInterrupt();
  port4.transceiver.handlePinChangeInterrupt();
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
  parseMessage(port1, port1.getMessage());

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
    messageHasBeenReceived |= parseMessage(port1, port1.getMessage());
    messageHasBeenReceived |= parseMessage(port2, port2.getMessage());
    messageHasBeenReceived |= parseMessage(port3, port3.getMessage());
    messageHasBeenReceived |= parseMessage(port4, port4.getMessage());
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
  if (numberOfPortWithParent == port1.number) {
    return port1.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == port2.number) {
    return port2.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == port3.number) {
    return port3.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == port4.number) {
    return port4.transceiver.transmissionIsInProgress();
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
OtherNode I(T &port) {
  OtherNode otherNode;
  otherNode.nodeId = nodeId;
  otherNode.portNumber = port.number;
  return otherNode;
}

// TODO: maybe create separate communication protocol file, or move to OtherNode.h
char encodePort(char otherNodeId, uint8_t portNumber) {
  uint8_t encodedNodeId = otherNodeId == '*' ?
    1 : // != 0, because otherwise encoding for *1 would be '\0'
    otherNodeId - 0x3f; // A -> B00010, B -> B00011, ...
  uint8_t encodedPortNumber =
    portNumber - 1; // 1 -> B00, 2 -> B01, ...
  return encodedNodeId << 2 | encodedPortNumber;
}

template <typename T>
void sendPairMessageToParent(T &port, const char *pairMessage) {
  port.transceiver.startTransmissionOfCharacters(pairMessage);
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
  port1.transceiver.begin();
  port2.transceiver.begin();
  port3.transceiver.begin();
  port4.transceiver.begin();
}

template <typename T>
void transmitAnnouncement(T &port) {
  char buffer[] = {'!',
                   encodePort(nodeId, port.number),
                   '\0'};
  port.transceiver.startTransmissionOfCharacters(buffer);
}

template <typename T>
void announceMeToChild(T &port) {
  if (port.number == numberOfPortWithParent) {
    return;
  }
  transmitAnnouncement(port);
  flashLed();
}

void resetParentExpiryTime() {
  parentExpiryTime = millis() + parentExpiryDuration; // ms
}

template <typename T>
void parseAnnouncementMessage(T &port, const char *message) {
  if (iAmRoot()) {
    return; // root cannot have a parent => ignore announcement
  }

  if (!iHaveAParent()) {
    numberOfPortWithParent = port.number;
  }

  if (port.number == numberOfPortWithParent) {
    resetParentExpiryTime(); // call regularly to keep parent fresh
  }

  // Create pair, either describing parent-child (I) relationship, or
  // loop:
  OtherNode otherNode = otherNodeFromPayload(message[1]);
  Pair pair;
  pair.firstNode = otherNode;
  pair.secondNode = I(port);
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
  pair.firstNode = otherNodeFromPayload(message[1]);
  pair.secondNode = otherNodeFromPayload(message[2]);
  return pair;
}

template <typename T>
bool parseMessage(T &port, char *message) {
  if (message == 0) {
    return false;
  }
  switch (message[0]) {
  case '!':
    parseAnnouncementMessage(port, message);
    return true;
  case '%':
    enqueuePairMessage(message);
    return true;
  }
  return false;
}

void sendPairMessageToParent(const char *pairMessage) {
  if (numberOfPortWithParent == port1.number) {
    sendPairMessageToParent(port1, pairMessage);
  } else if (numberOfPortWithParent == port2.number) {
    sendPairMessageToParent(port2, pairMessage);
  } else if (numberOfPortWithParent == port3.number) {
    sendPairMessageToParent(port3, pairMessage);
  } else if (numberOfPortWithParent == port4.number) {
    sendPairMessageToParent(port4, pairMessage);
  }
}

void announceMeToChildren() {
  announceMeToChild(port1);
  if (!iAmRoot()) {
    announceMeToChild(port2);
    announceMeToChild(port3);
    announceMeToChild(port4);
  }
}
