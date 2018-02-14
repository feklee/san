// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>
#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "config.h"
#include "Port.h"
#include "timeslot.h"
#include "OtherNode.h"
#include "Pair.h"
#include "newPairs.h"

static uint8_t nodeId;
static Port *ports[portsCount];
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
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(50);
}

static inline boolean isRoot() {
  return nodeId == 'a';
}

static inline boolean startsRequest(char c) {
  return c == '?';
}

OtherNode I(Port *port) {
  OtherNode I;
  I.nodeId = nodeId;
  I.portNumber = port->number;
  return I;
}

static void storeAsParent(Port *port, OtherNode otherNode) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port->neighbor = otherNode;
    Pair newPair(otherNode, I(port));
    enqueueNewPair(newPair);
  }
  port->neighborIsParent = true;
}

static void storeAsChild(Port *port, OtherNode otherNode,
                         boolean otherNodeClosesLoop = false) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port->neighbor = otherNode;
  }
  port->neighborIsParent = false;
  port->neighborClosesLoop = otherNodeClosesLoop;
}

static void removeChild(Port *port) {
  if (!port->neighbor.isEmpty()) {
    storeAsChild(port, emptyOtherNode);
    Pair newPair(I(port), emptyOtherNode);
    enqueueNewPair(newPair);
  }
}

static void removeParent(Port *port) {
  if (!port->neighbor.isEmpty()) {
    port->neighbor = emptyOtherNode; // don't queue as we're disconnected
  }
}

static boolean readRequest(Port *port) {
  const uint8_t payloadSize = 3;
  char payload[payloadSize];
  boolean payloadIsComplete = port->readPayload(payload, payloadSize);

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

static boolean waitForRequestAndSyncTime(Port *port,
                                         boolean doSyncTime = true) {
  uint8_t i = 0;
  port->serial->listen();
  port->serial->rxMode();
  openOverlappingCycle();
  while (!overlappingCycleHasEnded()) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsRequest(c)) {
        if (doSyncTime) {
          syncTimeSlotToParent();
        }
        if (readRequest(port)) {
          Pair fixme(port->neighbor, I(port));
          enqueueNewPair(fixme);
          return true;
        }
      }
    }
  }
  return false;
}

static void sendResponse(Port *port) {
  OtherNode &parent = port->neighbor;

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
  port->serial->txMode();
  port->serial->write(buffer);
}

static void sendRequest(Port *port) {
  port->serial->listen();
  port->serial->txMode();
  char buffer[] = {'?',
                   nodeId,
                   charFromDigit(port->number),
                   '\n', // line break for easy debugging
                   '\0'};
  port->serial->write(buffer);
  port->serial->rxMode();
}

static boolean waitForParentAndSyncTime(Port *port) {
  boolean requestWasReceived = waitForRequestAndSyncTime(port);
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

static Port *findParentAndSyncTime(Port *startPort) {
  static Port *port = startPort;
  while (!waitForParentAndSyncTime(port)) {
    port = port->next;
  }
  return port;
}

static boolean startsResponse(char c) {
  const char fromChild = '!';
  const char fromChildThatClosesLoop = '%';
  return c == fromChild || c == fromChildThatClosesLoop;
}

static boolean firstNodeIsI(Pair pair) {
  return pair.firstNode.nodeId == nodeId;
}

static boolean secondNodeIsMyNeighbor(Port *port, Pair pair) {
  return pair.secondNode == port->neighbor;
}

static boolean otherNodeIsMyNeighbor(Port *port, OtherNode otherNode) {
  return otherNode == port->neighbor;
}

static boolean pairIsNew(Port *port, Pair pair) {
  return !firstNodeIsI(pair) || !secondNodeIsMyNeighbor(port, pair);
}

static boolean readResponse(Port *port, boolean childClosesLoop) {
  const uint8_t payloadSize = 7;
  char payload[payloadSize];
  boolean payloadIsComplete = port->readPayload(payload, payloadSize);

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

static bool waitForResponse(Port *port) {
  while (!timeSlotHasEnded()) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsResponse(c)) {
        if (readResponse(port, c == '%')) {
          return true;
        }
      }
    }
  }
  return false;
}

static void deleteChildIfAgainNoResponse(Port *port,
                                         boolean responseHasBeenReceived) {
  if (!responseHasBeenReceived && port->noResponseLastTime) {
    removeChild(port);
  }
  port->noResponseLastTime = !responseHasBeenReceived;
}

static void askForChild(Port *port) {
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

// Check if on the other side there is another parent asking for a child. Then
// there is a loop.
static void checkIfThereIsALoop(Port *port) {
  boolean requestWasReceived = waitForRequestAndSyncTime(port, false); // fixme: maybe rename without sync time, or put that in separate variable

  if (!requestWasReceived) {
    removeParent(port);
    port->neighborClosesLoop = false;
    return;
  }
  port->neighborClosesLoop = true;
}

void setup() {
  nodeId = EEPROM.read(0);

  setRandomSeed(nodeId);

  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i] = new Port(portPins[i], i);
    ports[i]->serial->begin(4800);
  }

  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i]->next = ports[(portsCount + i - 1) % portsCount];
  }

  pinMode(ledPin, OUTPUT);
  flashLed();
}

void resetResponseStatus() {
  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i]->noResponseLastTime = false;
  }
}

void loop() {
  static Port *port = ports[0];
  static boolean loopCheckIsScheduled = false;
  Port *portWithParent;
  static uint8_t loopChecks = 0; // fixme

  // fixme: try at slower communication, then without blinking

  if (!isRoot()) {
    if (loopCheckIsScheduled) {
      loopCheckIsScheduled = false; // no more than one loop check in a row, to
                                    // allow replying to parent at least every
                                    // other time (loop check block replies to
                                    // parent for one cycle)
    } else {
      if (nodeId == 'c') { // fixme
        loopCheckIsScheduled = false; // fixme: for c
      } else {
        loopCheckIsScheduled = true;
      }
//      loopCheckIsScheduled = true;
//      loopCheckIsScheduled = randomNumber() % 10 < 1;
    }

    portWithParent = findParentAndSyncTime(port);
    port = portWithParent->next;

    if (loopCheckIsScheduled) {
    // fixme: portNumber = randomNumber() % (portsCount - 1)
/*    for (uint8_t i = 0 ; i < portsCount - 1; i ++) { // fixme: skipPorts
      port = port->next;
    }*/
      loopChecks ++;
//      debugChar = charFromDigit(loopChecks % 10); // fixme
      resetResponseStatus(); // because no responses recorded this cycle
      enqueueNewPair(Pair(OtherNode('X', 9), I(port))); // fixme
      checkIfThereIsALoop(port);
      port = portWithParent;
    } else {
      for (uint8_t i = 0 ; i < portsCount - 1; i ++) {
        askForChild(port);
        port = port->next;
      }
    }
  } else {
    askForChild(port);
    port = port->next;
    // Idea for root node: Forward data packages to external controller, without
    // waiting (but back-communication eventually is also needed - make root
    // send packages too, give it ID '*'). Maybe root communicate with network
    // on pin 0, and on two other pins it communicates full duplex with
    // something outside such as a Raspi or a Teensy.
  }
}
