// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>
#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "Port.h"
#include "timeslot.h"

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0, 4};
uint8_t nodeId;
const uint8_t portsCount = 2;
const unsigned long graceTime = 100; // time for other node to switch to receive

Port *ports[portsCount];

uint8_t digitFromChar(char c) {
  return c - 48;
}

char charFromDigit(uint8_t digit) {
  return digit + 48;
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

void readRequest(Port *port) {
  char payload[3];
  boolean payloadIsComplete = port->readPayload(payload, 3);

  if (!payloadIsComplete) {
    return;
  }

  port->neighbor.nodeId = payload[0];
  port->neighbor.sourcePortNumber = digitFromChar(payload[1]);
  port->connectsToParent = true;
}

void syncTimeSlotToParent() {
  openTimeSlotStartingAt(millis() - graceTime);
}

// Later:
//
// * Maybe cap time for one entire period of time slots (one second e.g.).
//
// * Cycle through ports.
void waitForRequestAndSyncTimeSlot(Port *port) {
  uint8_t i = 0;
  port->serial->listen();
  port->serial->rxMode();
  while (true) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsRequest(c)) {
        syncTimeSlotToParent();
        readRequest(port);
        return;
      }
    }
  }
}

void sendReply(Port *port) {
  port->serial->txMode();
  char buffer[] = {'!',
                   nodeId,
                   charFromDigit(port->number),
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

void waitForParent(Port *port) {
  waitForRequestAndSyncTimeSlot(port);
  flashLed();
  flashLed();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendReply(port);
  waitForEndOfTimeSlot();
}

boolean startsReply(char c) {
  return c == '!';
}

void readReply(Port *port) {
  char payload[3];
  boolean payloadIsComplete = port->readPayload(payload, 3);

  if (!payloadIsComplete) {
    return;
  }

  Neighbor neighbor;
  neighbor.nodeId = payload[0];
  neighbor.sourcePortNumber = payload[1];
  if (!(neighbor == port->neighbor)) {
    port->neighbor = neighbor;
    // fixme: pass this change on
  }
  port->connectsToParent = false;
}

void waitForReply(Port *port) {
  while (!timeSlotHasEnded()) {
    if (port->serial->available()) {
      char c = port->serial->read();
      if (startsReply(c)) {
        readReply(port);
        return;
      }
    }
  }
}

void askForChild(Port *port) {
  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendRequest(port);
  flashLed();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  waitForReply(port);
  waitForEndOfTimeSlot();
}

void loop() {
  static Port *port = ports[0];

  if (!isRoot()) {
    waitForParent(port);
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
