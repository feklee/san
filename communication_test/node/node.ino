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

uint8_t digitFromChar(char c) {
  return c - 48;
}

char charFromDigit(uint8_t digit) {
  return digit + 48;
}

OtherNode nodeFromPayload(char payload[2]) {
  return OtherNode(payload[0], digitFromChar(payload[1]));
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(50);
}

boolean isRoot() {
  return nodeId == 'a';
}

boolean startsRequest(char c) {
  return c == '?';
}

OtherNode I(Port *port) {
  OtherNode I;
  I.nodeId = nodeId;
  I.portNumber = port->number;
  return I;
}

void storeAsParent(Port *port, OtherNode otherNode) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port->neighbor = otherNode;
    Pair newPair(otherNode, I(port));
    enqueueNewPair(newPair);
  }
  port->neighborIsParent = true;
}

void storeAsChild(Port *port, OtherNode otherNode) {
  boolean neighborIsNew = !otherNodeIsMyNeighbor(port, otherNode);
  if (neighborIsNew) {
    port->neighbor = otherNode;
  }
  port->neighborIsParent = false;
}

void removeChild(Port *port) {
  if (!port->neighbor.isEmpty()) {
    storeAsChild(port, emptyOtherNode);
    Pair newPair(I(port), emptyOtherNode);
    enqueueNewPair(newPair);
  }
}

void removeParent(Port *port) {
  if (!port->neighbor.isEmpty()) {
    port->neighbor = emptyOtherNode; // don't queue as we're disconnected
  }
}

boolean readRequest(Port *port) {
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

void syncTimeSlotToParent() {
  openTimeSlotStartingAt(millis() - graceTime);
}

// fixme, later:
//
// * Maybe cap time for one entire period of time slots (one second e.g.).
//
// * Cycle through ports.
boolean waitForRequestAndSyncTimeSlot(Port *port) {
  uint8_t i = 0;
  port->serial->listen();
  port->serial->rxMode();
  openOverlappingCycle();
  while (!overlappingCycleHasEnded()) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsRequest(c)) {
        syncTimeSlotToParent();
        if (readRequest(port)) {
          return true;
        }
      }
    }
  }
  return false;
}

void sendResponse(Port *port) {
  OtherNode &parent = port->neighbor;

  Pair pair = dequeueNewPair();

  port->serial->txMode();
  char buffer[] = {'!',
                   pair.firstNode.nodeId,
                   charFromDigit(pair.firstNode.portNumber),
                   pair.secondNode.nodeId,
                   charFromDigit(pair.secondNode.portNumber),
                   debugChar,
                   '\n', // line break for easy debugging
                   '\0'};
  port->serial->write(buffer);
}

void setup() {
  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i] = new Port(portPins[i], i);
  }

  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i]->next = ports[(portsCount + i - 1) % portsCount];
  }

  nodeId = EEPROM.read(0);
  for (uint8_t i = 0; i < portsCount; i ++) {
    ports[i]->serial->begin(4800);
  }
  pinMode(ledPin, OUTPUT);
  flashLed();
}

void sendRequest(Port *port) {
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

boolean waitForParentAndSyncTimeSlot(Port *port) {
  boolean requestWasReceived = waitForRequestAndSyncTimeSlot(port);
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

boolean startsResponse(char c) {
  return c == '!';
}

boolean firstNodeIsI(Pair pair) {
  return pair.firstNode.nodeId == nodeId;
}

boolean secondNodeIsMyNeighbor(Port *port, Pair pair) {
  return pair.secondNode == port->neighbor;
}

boolean otherNodeIsMyNeighbor(Port *port, OtherNode otherNode) {
  return otherNode == port->neighbor;
}

boolean pairIsNew(Port *port, Pair pair) {
  return !firstNodeIsI(pair) || !secondNodeIsMyNeighbor(port, pair);
}

boolean readResponse(Port *port) {
  const uint8_t payloadSize = 6;
  char payload[payloadSize];
  boolean payloadIsComplete = port->readPayload(payload, payloadSize);

  if (!payloadIsComplete) {
    return false;
  }

  Pair pair(nodeFromPayload(payload), nodeFromPayload(payload + 2));

  if (pairIsNew(port, pair)) {
    enqueueNewPair(pair);
    if (firstNodeIsI(pair)) {
      storeAsChild(port, pair.secondNode);
    }
  }

  return true;
}

bool waitForResponse(Port *port) {
  while (!timeSlotHasEnded()) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsResponse(c)) {
        if (readResponse(port)) {
          return true;
        }
      }
    }
  }
  return false;
}

void askForChild(Port *port) {
  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendRequest(port);
  flashLed();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  boolean responseHasBeenReceived = waitForResponse(port);
  if (!responseHasBeenReceived) {
    removeChild(port);
  }
  waitForEndOfTimeSlot();
}

void loop() {
  static Port *port = ports[0];

  // fixme: Currently does not realize when not connected to root anymore, and
  // vice versa. So data is not resend. => Maybe clear neighbor after each
  // failed attempt searching for a parent.

  if (!isRoot()) {
    waitForParentAndSyncTimeSlot(port);
    port = port->next;
  } else {
    // Idea for root node: Forward data packages to external controller, without
    // waiting (but back-communication eventually is also needed - make root
    // send packages too, give it ID '*'). Maybe root communicate with network
    // on pin 0, and on two other pins it communicates full duplex with
    // something outside such as a Raspi or a Teensy.
  }

  for (uint8_t i = 0 ; i < portsCount - 1; i ++) {
    askForChild(port);
    port = port->next;
  }
}
