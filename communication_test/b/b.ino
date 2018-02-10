// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>
#include <San.h>

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0};
const char nodeId = 'b';
const unsigned long graceTime = 100; // time for other node to switch to receive

struct neighbor_t {
  char nodeId;
  byte sourcePort; // port on the neighbor that leads to here (0 - 3)
  boolean isParent;
};

neighbor_t neighbors[1]; // sorted by port

San san;

boolean startsRequest(char c) {
  return c == '?';
}

void readRequest() {
  char payload[2];
  boolean payloadIsComplete = san.readPayload(payload, 3);

  return;

  if (!payloadIsComplete) {
    return;
  }

  neighbor_t &neighbor = neighbors[0];
  neighbor.nodeId = payload[0];
  neighbor.sourcePort = san.digitFromChar(payload[1]);
}

void syncTimeSlotToParent() {
  san.openTimeSlotStartingAt(millis() - graceTime);
}

// Later:
//
// * Maybe cap time for one entire period of time slots (one second e.g.).
//
// * Cycle through ports.
void waitForRequestAndSyncTimeSlot() {
  int i = 0;
  san.ports[0]->rxMode();
  while (true) {
    if (san.ports[0]->available()) {
      char c = san.ports[0]->read();
      if (startsRequest(c)) {
        syncTimeSlotToParent();
        readRequest();
        return;
      }
    }
  }
}

void sendReply() {
  san.ports[0]->txMode();
  char buffer[] = {'!', nodeId, '0', '\n', '\0'}; // line break for easy debugging
  san.ports[0]->write(buffer);
}

void setup() {
  san.ports[0]->begin(4800);
  pinMode(ledPin, OUTPUT);
  san.flashLed();
}

void giveOtherSideTimeToGetReady() {
  delay(graceTime);
}

void loop() {
  waitForRequestAndSyncTimeSlot();
  san.waitForEndOfTimeSlot();

  san.openNextTimeSlot();
  san.flashLed();
  san.flashLed();
  giveOtherSideTimeToGetReady();
  sendReply();
  san.waitForEndOfTimeSlot();
}
