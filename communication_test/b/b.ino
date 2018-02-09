// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0};
const char nodeId = 'b';
const unsigned long timeSlotDuration = 500; // ms
const unsigned long graceTime = 5; // time for other node to switch to receive

unsigned long endOfTimeSlot; // ms

struct neighbor_t {
  char nodeId;
  byte sourcePort; // port on the neighbor that leads to here (0 - 3)
  boolean isParent;
};

neighbor_t neighbors[1]; // sorted by port

SoftSerial port0(portPins[0], portPins[0]);

void scheduleEndOfTimeSlot(unsigned long startTime) {
  endOfTimeSlot = startTime + timeSlotDuration;
}

boolean startsReqToIdentify(char c) {
  return c == '?';
}

char receiveNextChar() {
  while (true) {
    if (port0.available()) {
      return port0.read();
    }
  }
}

byte digitFromChar(char c) {
  return c - 48;
}

void readReqToIdentify() {
  neighbor_t &neighbor = neighbors[0];
  neighbor.nodeId = receiveNextChar();
  neighbor.sourcePort = digitFromChar(receiveNextChar());
}

// Later:
//
// * Maybe cap time for one entire period of time slots (one second e.g.).
//
// * Cycle through ports.
void waitForReqToIdentify() {
  int i = 0;
  port0.rxMode();
  while (true) {
    if (port0.available()) {
      char c = port0.read();
      if (startsReqToIdentify(c)) {
        scheduleEndOfTimeSlot(millis());
        readReqToIdentify();
        return;
      }
    }
  }
}

void waitForEndOfTimeSlot() {
  while (millis() < endOfTimeSlot) {
    delay(1);
  }
}

void sendIdentification() {
  port0.txMode();
  char buffer[] = {'!', nodeId, 0, '\n', '\0'}; // line break for easy debugging
  port0.write(buffer);
}

void setup() {
  port0.begin(4800);
  pinMode(ledPin, OUTPUT);
  scheduleEndOfTimeSlot(millis());
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(25);
  digitalWrite(ledPin, LOW);
  delay(25);
}

void giveOtherSideTimeToGetReady() {
  delay(graceTime);
}

void loop() {
  scheduleEndOfTimeSlot(endOfTimeSlot);
  waitForReqToIdentify();
  flashLed();
  waitForEndOfTimeSlot();

  scheduleEndOfTimeSlot(endOfTimeSlot);
  giveOtherSideTimeToGetReady();
  sendIdentification();
  waitForEndOfTimeSlot();
}
