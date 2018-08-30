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
static Port port1(2, 1);
static Port port2(3, 2);
static Port port3(4, 8);
static Port port4(5, 9);
static Port *ports[] = {&port1, &port2, &port3, &port4};
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

OtherNode I(Port &port) {
  OtherNode I;
  I.nodeId = nodeId;
  I.portNumber = port.number;
  return I;
}

static void storeAsParent(Port &port, OtherNode otherNode) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port.neighbor = otherNode;
    Pair newPair(otherNode, I(port));
    enqueueNewPair(newPair);
  }
  port.neighborType = parent;
}

static void storeAsChild( // fixme: rename
  Port &port, OtherNode otherNode,
  boolean otherNodeClosesLoop = false) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port.neighbor = otherNode;
  }
  port.neighborType = otherNodeClosesLoop ? closesLoop : child;
}

static void removeNeighbor(Port &port) {
  port.neighbor = emptyOtherNode;
  port.neighborType = none;
}

static void removeChild(Port &port) {
  if (!port.neighbor.isEmpty()) {
    removeNeighbor(port);
    Pair newPair(I(port), port.neighbor);
    enqueueNewPair(newPair);
  }
}

static void removeParent(Port &port) {
  if (!port.neighbor.isEmpty()) {
    removeNeighbor(port);
    // don't queue as we're disconnected
  }
}

static boolean readRequest(Port &port) {
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

static boolean waitForRequestAndThenSyncTime(Port &port,
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

static void sendResponse(Port &port) {
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

static void sendRequest(Port &port) {
  port.serial->listen();
  char buffer[] = {'?',
                   nodeId,
                   charFromDigit(port.number),
                   '\n', // line break for easy debugging
                   '\0'};
  port.serial->write(buffer);
}

static boolean waitForParentAndThenSyncTime(Port &port) {
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

static uint8_t findParentAndThenSyncTime(uint8_t startPortNumber) {
  uint8_t portNumber = startPortNumber;
  while (true) {
    Port *port = ports[portNumber - 1];
    bool parentDetected = waitForParentAndThenSyncTime(*port);
    if (parentDetected) {
      break;
    }
    portNumber = nextPortNumber(portNumber);
  }
  return portNumber;
}

static boolean startsResponse(char c) {
  const char fromChild = '!';
  const char fromChildThatClosesLoop = '%';
  return c == fromChild || c == fromChildThatClosesLoop;
}

static boolean firstNodeIsI(Pair pair) {
  return pair.firstNode.nodeId == nodeId;
}

static boolean secondNodeIsMyNeighbor(Port &port, Pair pair) {
  return pair.secondNode == port.neighbor;
}

static boolean otherNodeIsMyNeighbor(Port &port, OtherNode otherNode) {
  return otherNode == port.neighbor;
}

static boolean pairIsNew(Port &port, Pair pair) {
  return !firstNodeIsI(pair) || !secondNodeIsMyNeighbor(port, pair);
}

static boolean readResponse(Port &port, boolean childClosesLoop) {
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

static bool waitForResponse(Port &port) {
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

static void deleteChildIfAgainNoResponse(Port &port,
                                         boolean responseHasBeenReceived) {
  if (!responseHasBeenReceived && port.noResponseLastTime) {
    removeChild(port);
  }
  port.noResponseLastTime = !responseHasBeenReceived;
}

static void askForChild(Port &port) {
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
static void checkIfThereIsALoop(Port &port) {
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

  port1.next = &port2;
  port2.next = &port3;
  port3.next = &port4;
  port4.next = &port1;

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

void nonRootLoop() {
  static uint8_t portNumber = 1;

  portNumber = findParentAndThenSyncTime(portNumber);
  portNumber = nextPortNumber(portNumber);

  for (uint8_t i = 0 ; i < portsCount - 1; i ++) {
    askForChild(*ports[portNumber - 1]);
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
