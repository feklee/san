// Tested with Arduino Pro Mini

#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "config.h"
#include "Port.h"
#include "timeslot.h"
#include "OtherNode.h"
#include "Pair.h"
#include "newPairs.h"

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

  setRandomSeed(nodeId);

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

void rootLoop() {
  parseMessage(port1, port1.getMessage());

  Pair pair = dequeueNewPair();
  if (!pair.isEmpty()) {
    char buffer[] = {
      pair.firstNode.nodeId,
      charFromDigit(pair.firstNode.portNumber),
      pair.secondNode.nodeId,
      charFromDigit(pair.secondNode.portNumber),
      '\0'
    };

    Serial.println(buffer);
  }

  periodicallyReportToChildren();
}

void nonRootLoop() {
  parseMessage(port1, port1.getMessage());
  parseMessage(port2, port2.getMessage());
  parseMessage(port3, port3.getMessage());
  parseMessage(port4, port4.getMessage());

  reportToParent();

  periodicallyReportToChildren();
}

void periodicallyReportToChildren() {
  static uint32_t reportToChildrenTime =
    millis() + reportToChildrenPeriod; // ms

  if (millis() >= reportToChildrenTime) {
    Serial.println("reporting...");
    reportToChildren();
    reportToChildrenTime = millis() + reportToChildrenPeriod;
  }
}

static inline void setRandomSeed(long x) {
  randx = x;
}

// Including the Arduino random library makes the code too big.
static inline int randomNumber() {
  return ((int)((randx = randx * 1103515245L + 12345) >> 16) & 077777);
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
  return c == '?';
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
  Pair newPair(otherNode, I(port));
  enqueueNewPair(newPair);
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
    Pair newPair(I(port), port.neighbor);
    enqueueNewPair(newPair);
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
void reportToParent(T &port) {
  Pair pair = dequeueNewPair();

  if (port.transceiver.transmissionIsInProgress()) {
    return;
  }

  if (pair.isEmpty()) {
    return;
  }

  char buffer[] = {'!',
                   pair.firstNode.nodeId,
                   charFromDigit(pair.firstNode.portNumber),
                   pair.secondNode.nodeId,
                   charFromDigit(pair.secondNode.portNumber),
                   ' ', // fixme: maybe turn into loop closing
                        // thingy, but even that doesn't seem
                        // necessary (info already stored in
                        // node)
                   debugChar,
                   '\n', // line break for easy debugging
                   '\0'};
  port.transceiver.startTransmissionOfCharacters(buffer);
}

template <typename T>
void sendRequest(T &port) {
  char buffer[] = {'?',
                   nodeId,
                   charFromDigit(port.number),
                   '\n', // line break for easy debugging
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
boolean pairIsNew(T &port, Pair pair) {
  return !firstNodeIsI(pair) || !secondNodeIsMyNeighbor(port, pair);
}

template <typename T>
boolean readResponse(T &port, boolean childClosesLoop) {
  const uint8_t payloadSize = 7;
  char payload[payloadSize];
  boolean payloadIsComplete = port.readPayload(payload, payloadSize);

  if (!payloadIsComplete) {
    return false;
  }

  Pair pair(nodeFromPayload(payload), nodeFromPayload(payload + 2));

  if (pairIsNew(port, pair)) {
    enqueueNewPair(pair);
    if (firstNodeIsI(pair)) {
      storeAsChild(port, pair.secondNode, childClosesLoop);
    }
  }

  return true;
}

template <typename T>
bool waitForResponse(T &port) {
  while (!timeSlotHasEnded()) {
    char c = port.transceiver.getNextCharacter();
    if (c) {
      if (startsResponse(c)) {
        if (readResponse(port, c == '%')) {
          return true;
        }
      }
    }
  }
  return false;
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
      Pair newPair(port.neighbor, I(port));
      enqueueNewPair(newPair);
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
void reportToChild(T &port) {
  if (port.neighborType != parent) {
    sendRequest(port); // TODO: rename
    flashLed();
  }
}

template <typename T>
void parseParentPayload(T &port, char *payload) {
  Serial.println("Parsing parent payload"); // TODO
  if (iAmRoot()) {
    return;
  }
  OtherNode otherNode;
  otherNode = nodeFromPayload(payload);
  storeAsParent(port, otherNode);
}

template <typename T>
void parseNewPairPayload(T &port, char *payload) {
  Pair pair(nodeFromPayload(payload), nodeFromPayload(payload + 2));
  boolean childClosesLoop = false; // TODO

  if (pairIsNew(port, pair)) {
    enqueueNewPair(pair);
    if (firstNodeIsI(pair)) {
      storeAsChild(port, pair.secondNode, childClosesLoop);
    }
  }
}

template <typename T>
void parseMessage(T &port, char *message) {
  if (message == 0) {
    return;
  }
  Serial.println("Parsing message"); // TODO
  switch (message[0]) {
  case '?':
    parseParentPayload(port, message + 1);
    return;
  case '!':
    parseNewPairPayload(port, message + 1);
    return;
  }
}

void reportToParent() {
  if (port1.neighborType == parent) {
    reportToParent(port1);
    return;
  }
  if (port2.neighborType == parent) {
    reportToParent(port2);
    return;
  }
  if (port3.neighborType == parent) {
    reportToParent(port3);
    return;
  }
  if (port4.neighborType == parent) {
    reportToParent(port4);
    return;
  }
}

void reportToChildren() {
  reportToChild(port1);
  if (iAmRoot()) {
    return;
  }
  reportToChild(port2);
  reportToChild(port3);
  reportToChild(port4);
}
