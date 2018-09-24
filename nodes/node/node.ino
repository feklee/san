// Tested with Arduino Pro Mini

// Basic algorithm idea: Parent nodes announce themselves. When a node
// sees the announcement of a parent, it creates a pair with the
// announcing node and itself. Pairs are propagated up to the root
// node.

#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "settings.h"
#include "Port.h"
#include "OtherNode.h"
#include "Pair.h"
#include "pairQueue.h"

static char nodeId;

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

void setup() {
  nodeId = EEPROM.read(0);

  pinMode(ledPin, OUTPUT);
  flashLed();

// TODO  if (iAmRoot()) {
    Serial.begin(115200);
// TODO  }

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

  Pair pair = dequeuePair();
  if (!pair.isEmpty()) {
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

  if (!transmissionToParentIsInProgress()) {
    Pair pair = dequeuePair();
    if (!pair.isEmpty()) {
      sendPairToParent(pair);
    }
  }

  // TODO: what to do if no parent? just forget all pairs / empty the
  // queue?

  if (iHaveAParent()) {
    periodicallyAnnounceMe();
  }

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

static inline OtherNode nodeFromPayload(char payload[2]) {
  return OtherNode(payload[0], digitFromChar(payload[1]));
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
  OtherNode I;
  I.nodeId = nodeId;
  I.portNumber = port.number;
  return I;
}

template <typename T>
void sendPairToParent(T &port, const Pair &pair) {
  if (port.transceiver.transmissionIsInProgress()) {
    return;
  }

  char buffer[] = {'%',
                   pair.firstNode.nodeId,
                   charFromDigit(pair.firstNode.portNumber),
                   pair.secondNode.nodeId,
                   charFromDigit(pair.secondNode.portNumber),
                   '\0'};
  port.transceiver.startTransmissionOfCharacters(buffer);
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
                   nodeId,
                   charFromDigit(port.number),
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
void parseAnnouncementPayload(T &port, char *payload) {
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
  OtherNode otherNode;
  otherNode = nodeFromPayload(payload);
  Pair pair(otherNode, I(port));
  enqueuePair(pair);
}

void parsePairPayload(char *payload) {
  Pair pair(nodeFromPayload(payload), nodeFromPayload(payload + 2));
  enqueuePair(pair);
}

template <typename T>
bool parseMessage(T &port, char *message) {
  if (message == 0) {
    return false;
  }
  char *payload = message + 1;
  switch (message[0]) {
  case '!':
    parseAnnouncementPayload(port, payload);
    return true;
  case '%':
    parsePairPayload(payload);
    return true;
  }
  return false;
}

void sendPairToParent(const Pair &pair) {
  if (numberOfPortWithParent == port1.number) {
    sendPairToParent(port1, pair);
  }
  if (numberOfPortWithParent == port2.number) {
    sendPairToParent(port2, pair);
  }
  if (numberOfPortWithParent == port3.number) {
    sendPairToParent(port3, pair);
  }
  if (numberOfPortWithParent == port4.number) {
    sendPairToParent(port4, pair);
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
