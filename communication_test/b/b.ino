// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>
#include <San.h>
#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "Port.h"
#include "timeslot.h"

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0, 4};
char nodeId;
const int portsCount = 2;
const unsigned long graceTime = 100; // time for other node to switch to receive

Port *ports[portsCount];

struct neighbor_t {
  char nodeId;
  byte sourcePort; // port on the neighbor that leads to here (0 - 3)
  boolean isParent;
};

neighbor_t neighbors[portsCount]; // sorted by port

San san;

boolean isRoot() {
  return nodeId == 'a';
}

boolean startsRequest(char c) {
  return c == '?';
}

void readRequest(Port *port) {
  char payload[3];
  boolean payloadIsComplete = port->readPayload(payload, 3);

  return;

  if (!payloadIsComplete) {
    return;
  }

  neighbor_t &neighbor = neighbors[0];
  neighbor.nodeId = payload[0];
  neighbor.sourcePort = port->digitFromChar(payload[1]);
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
  int i = 0;
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
  char buffer[] = {'!', nodeId, '0', '\n', '\0'}; // line break for easy debugging
  port->serial->write(buffer);
}

void setup() {
  for (int i = 0; i < portsCount; i ++) {
    ports[i] = new Port(portPins[i]);
  }

  for (int i = 0; i < portsCount; i ++) {
    ports[i]->next = ports[(i - 1 % 4)];
  }

  nodeId = EEPROM.read(0);
  for (int i = 0; i < portsCount; i ++) {
    ports[i]->serial->begin(4800);
  }
  pinMode(ledPin, OUTPUT);
  san.flashLed();
}

void sendRequest(Port *port) {
  port->serial->listen();
  port->serial->txMode();
  char buffer[] = {'?', nodeId, '1', '\n', '\0'}; // line break for easy debugging
  port->serial->write(buffer);
  port->serial->rxMode();
}

void waitForParent(Port *port) {
  waitForRequestAndSyncTimeSlot(port);
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  san.flashLed();
  san.flashLed();
  giveOtherSideTimeToGetReady();
  sendReply(port);
  waitForEndOfTimeSlot();
}

void loop() {
  waitForParent(ports[0]);

#if 0
  Port *port = ports[0];

  if (!isRoot()) {
    while (true) {
      waitForParent(port); // do this each for max. T = 2 × t
      port = port->next;
    }
  }

  if (isRoot()) {
    // forward data packages to external controller, without waiting (but back
    // communication eventually is also needed - make root send packages too,
    // give it ID '*'). Maybe root communicate with network on pin 0, and on two
    // other pins it communicates full duplex with something outside such as a
    // Raspi or a Teensy.
  }

  for (int i = 0; i < 3; i ++) {
//    queryChild(port);
    port = port->next;
  }
#endif
}
