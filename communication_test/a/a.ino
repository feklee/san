// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>
#include <San.h>
#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "Port.h"
#include "timeslot.h"

const uint8_t ledPin = 1;
char nodeId;
const int portsCount = 2;
const uint8_t portPins[] = {0, 4};
Port *ports[portsCount];

struct neighbor_t {
  char nodeId;
  byte sourcePort; // port on the neighbor that leads to here (0 - 3)
  boolean isParent;
};

neighbor_t neighbors[2]; // sorted by port

San san;

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

boolean startsReply(char c) {
  return c == '!';
}

void readReply(Port *port) {
  char payload[3];
  boolean payloadIsComplete = port->readPayload(payload, 3);

  if (!payloadIsComplete) {
    return;
  }

  neighbor_t &neighbor = neighbors[1];
  neighbor.nodeId = payload[0];
  neighbor.sourcePort = port->digitFromChar(payload[1]);
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

void loop() {
  Port *port = ports[1];

  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendRequest(port);
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  san.flashLed();
  san.flashLed();
  waitForReply(port);
  waitForEndOfTimeSlot();
}
