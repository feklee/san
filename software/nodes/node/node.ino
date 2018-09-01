// Tested with Arduino Pro Mini

#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "config.h"
#include "Port.h"
#include "timeslot.h"
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
static char debugChar = '|'; // Can be used to indicate status during debugging

static long randx;

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

void nonRootLoop() {
  parseMessage(port1, port1.getMessage());
  parseMessage(port2, port2.getMessage());
  parseMessage(port3, port3.getMessage());
  parseMessage(port4, port4.getMessage());

  Pair pair = dequeuePair();
  if (!pair.isEmpty()) {
    sendPairToParent(pair);
  }

  periodicallyAnnounceMe();
}

void periodicallyAnnounceMe() {
  static uint32_t scheduledAnnouncementTime =
    millis() + announcementPeriod; // ms

  if (millis() >= scheduledAnnouncementTime) {
    Serial.println("reporting...");
    announceMeToChildren();
    scheduledAnnouncementTime = millis() + announcementPeriod;
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

static inline boolean iAmRoot() {
  return nodeId == '*';
}

static inline boolean startsRequest(char c) {
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
void storeAsParent(T &port, OtherNode otherNode) {
  Serial.println("store as parent"); // TODO
  port.neighbor = otherNode;
  Pair pair(otherNode, I(port));
  enqueuePair(pair);
  port.neighborType = parent;
}

template <typename T>
void storeAsChild( // fixme: rename
  T &port, OtherNode otherNode,
  boolean otherNodeClosesLoop = false) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port.neighbor = otherNode;
  }
  port.neighborType = otherNodeClosesLoop ? closesLoop : child;
}

template <typename T>
void removeNeighbor(T &port) {
  port.neighbor = emptyOtherNode;
  port.neighborType = none;
}

template <typename T>
void removeChild(T &port) {
  if (!port.neighbor.isEmpty()) {
    removeNeighbor(port);
    Pair pair(I(port), port.neighbor);
    enqueuePair(pair);
  }
}

template <typename T>
void removeParent(T &port) {
  if (!port.neighbor.isEmpty()) {
    removeNeighbor(port);
    // don't queue as we're disconnected
  }
}

static void syncTimeSlotToParent() {
  openTimeSlotStartingAt(millis() - graceTime);
}

template <typename T>
void sendPairToParent(T &port, const Pair &pair) {
  if (port1.neighborType != parent) {
    return;
  }

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

uint8_t nextPortNumber(uint8_t portNumber) {
  return portNumber % 4 + 1;
}

static boolean startsResponse(char c) {
  const char fromChild = '!';
  const char fromChildThatClosesLoop = '%';
  return c == fromChild || c == fromChildThatClosesLoop;
}

static boolean firstNodeIsI(Pair pair) {
  return pair.firstNode.nodeId == nodeId;
}

template <typename T>
boolean secondNodeIsMyNeighbor(T &port, Pair pair) {
  return pair.secondNode == port.neighbor;
}

template <typename T>
boolean otherNodeIsMyNeighbor(T &port, OtherNode otherNode) {
  return otherNode == port.neighbor;
}

template <typename T>
void deleteChildIfAgainNoResponse(T &port,
                                  boolean responseHasBeenReceived) {
  if (!responseHasBeenReceived && port.noResponseLastTime) {
    removeChild(port);
  }
  port.noResponseLastTime = !responseHasBeenReceived;
}

#if 0 // TODO: remove eventually
// Check if the other node is asking for a child. Then there is a loop.
template <typename T>
void checkIfThereIsALoop(T &port) {
  boolean requestWasReceived = waitForRequestAndThenSyncTime(port, false); // fixme: maybe rename without sync time, or put that in separate variable

  if (!requestWasReceived) { // fixme: may be wrong answer if parent is doing something! => neighbor report may turn on and off randomly, from time to time
    if (!port.neighbor.isEmpty()) {
      removeNeighbor(port);
      Pair pair(port.neighbor, I(port));
      enqueuePair(pair);
    }
    return;
  }
  port.neighborType = closesLoop; // fixme: do that assignment when reading
                                   // request
}
#endif

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

void resetResponseStatus() {
  port1.noResponseLastTime = false;
  port2.noResponseLastTime = false;
  port3.noResponseLastTime = false;
  port4.noResponseLastTime = false;
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
  if (port.neighborType == parent) {
    return;
  }
  transmitAnnouncement(port);
  flashLed();
}

template <typename T>
void parseAnnouncementPayload(T &port, char *payload) {
  if (iAmRoot()) {
    return; // root cannot have a parent
  }
  OtherNode otherNode;
  otherNode = nodeFromPayload(payload);
  storeAsParent(port, otherNode);
}

template <typename T>
void parsePairPayload(T &port, char *payload) {
  Pair pair(nodeFromPayload(payload), nodeFromPayload(payload + 2));
  boolean childClosesLoop = false; // TODO

  enqueuePair(pair);
  if (firstNodeIsI(pair)) {
    storeAsChild(port, pair.secondNode, childClosesLoop);
  }
}

template <typename T>
void parseMessage(T &port, char *message) {
  if (message == 0) {
    return;
  }
  switch (message[0]) {
  case '!':
    parseAnnouncementPayload(port, message + 1);
    return;
  case '%':
    parsePairPayload(port, message + 1);
    return;
  }
}

void sendPairToParent(const Pair &pair) {
  sendPairToParent(port1, pair);
  sendPairToParent(port2, pair);
  sendPairToParent(port3, pair);
  sendPairToParent(port4, pair);
}

void announceMeToChildren() {
  announceMeToChild(port1);
  if (!iAmRoot()) {
    announceMeToChild(port2);
    announceMeToChild(port3);
    announceMeToChild(port4);
  }
}
