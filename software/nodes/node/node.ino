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
static char debugChar = ' '; // Can be used to indicate status during debugging

static long randx;

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
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port.neighbor = otherNode;
    Pair newPair(otherNode, I(port));
    enqueueNewPair(newPair);
  }
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

template <typename T>
boolean readRequest(T &port) {
  const uint8_t payloadSize = 3;
  char payload[payloadSize];
  boolean payloadIsComplete = port.readPayload(payload, payloadSize, false);

  if (!payloadIsComplete) {
    return false;
  }

  OtherNode otherNode;
  otherNode = nodeFromPayload(payload);

  storeAsParent(port, otherNode);

  return true;
}

static void syncTimeSlotToParent() {
  openTimeSlotStartingAt(millis() - graceTime);
}

template <typename T>
boolean waitForRequestAndThenSyncTime(T &port,
                                      boolean doSyncTime = true) {
  port.serial->listen();
  startOverlappingCycle();
  while (!overlappingCycleHasEnded()) {
    if (port.serial->available()) {
      char c = port.serial->read();
      if (startsRequest(c)) {
        if (doSyncTime) {
          syncTimeSlotToParent();
        }
        if (readRequest(port)) {
          return true;
        }
      }
    }
  }
  return false;
}

template <typename T>
void sendResponse(T &port) {
  Pair pair = dequeueNewPair();

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
  port.serial->write(buffer);
}

template <typename T>
void sendRequest(T &port) {
  port.serial->listen();
  char buffer[] = {'?',
                   nodeId,
                   charFromDigit(port.number),
                   '\n', // line break for easy debugging
                   '\0'};
  port.serial->write(buffer);
}

template <typename T>
boolean waitForParentAndThenSyncTime(T &port) {
  boolean requestWasReceived = waitForRequestAndThenSyncTime(port);
  if (!requestWasReceived) {
    removeParent(port);
    return false;
  }
  flashLed();
  flashLed();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendResponse(port);
  waitForEndOfTimeSlot();

  return true;
}

uint8_t nextPortNumber(uint8_t portNumber) {
  return portNumber % 4 + 1;
}

bool waitForParentAndThenSyncTime(uint8_t portNumber) {
  switch (portNumber) {
  case 1:
    return waitForParentAndThenSyncTime(port1);
  case 2:
    return waitForParentAndThenSyncTime(port2);
  case 3:
    return waitForParentAndThenSyncTime(port3);
  default:
    return waitForParentAndThenSyncTime(port4);
  }
}

static uint8_t findParentAndThenSyncTime(uint8_t startPortNumber) {
  uint8_t portNumber = startPortNumber;
  while (true) {
    bool parentDetected = waitForParentAndThenSyncTime(portNumber);
    if (parentDetected) {
      return portNumber;
    }
    portNumber = nextPortNumber(portNumber);
  }
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
    if (port.serial->available()) {
      char c = port.serial->read();
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

template <typename T>
void askForChild(T &port) {
  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendRequest(port);
  flashLed();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  boolean responseHasBeenReceived = waitForResponse(port);
  deleteChildIfAgainNoResponse(port, responseHasBeenReceived);
  waitForEndOfTimeSlot();
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

void setup() {
  nodeId = EEPROM.read(0);

  setRandomSeed(nodeId);

  port1.serial->begin(19200);
  port2.serial->begin(19200);
  port3.serial->begin(19200);
  port4.serial->begin(19200);

  pinMode(ledPin, OUTPUT);
  flashLed();

  if (iAmRoot()) {
    Serial.begin(115200);
  }
}

void resetResponseStatus() {
  port1.noResponseLastTime = false;
  port2.noResponseLastTime = false;
  port3.noResponseLastTime = false;
  port4.noResponseLastTime = false;
}

void rootLoop() {
  startCycleWithNextTimeSlot();
  askForChild(port1);

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

  waitForEndOfCycle();
}

void askForChild(uint8_t portNumber) {
  switch (portNumber) {
  case 1:
    askForChild(port1);
    break;
  case 2:
    askForChild(port2);
    break;
  case 3:
    askForChild(port3);
    break;
  default:
    askForChild(port4);
    break;
  }
}

void nonRootLoop() {
  static uint8_t portNumber = 1;

  portNumber = findParentAndThenSyncTime(portNumber);
  portNumber = nextPortNumber(portNumber);

  for (uint8_t i = 0 ; i < portsCount - 1; i ++) {
    askForChild(portNumber);
    portNumber = nextPortNumber(portNumber);
  }
}

void loop() {
  if (iAmRoot()) {
    rootLoop();
  } else {
    nonRootLoop();
  }
}
