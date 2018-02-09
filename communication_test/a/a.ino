// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0, 4};
const char nodeId = 'a';
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
SoftSerial port1(portPins[1], portPins[1]);

void scheduleEndOfTimeSlot(unsigned long startTime) {
  endOfTimeSlot = startTime + timeSlotDuration;
}

void setup() {
  port0.begin(4800);
  port1.begin(4800);
  pinMode(ledPin, OUTPUT);
  scheduleEndOfTimeSlot(millis());
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(25);
  digitalWrite(ledPin, LOW);
  delay(25);
}

void sendReqToIdentify() {
  port1.listen();
  port1.txMode();
  char buffer[] = {'?', nodeId, 1, '\n', '\0'}; // line break for easy debugging
  port1.write(buffer);
}

boolean startsIdentification(char c) {
  return c == '!';
}

char receiveNextChar() {
  while (true) {
    if (port1.available()) {
      return port1.read();
    }
  }
}

byte digitFromChar(char c) {
  return c - 48;
}

void readIdentification() {
  neighbor_t &neighbor = neighbors[1];
  neighbor.nodeId = receiveNextChar();
  neighbor.sourcePort = digitFromChar(receiveNextChar());
}

void giveOtherSideTimeToGetReady() {
  delay(graceTime);
}

void waitForIdentification() {
  int i = 0;
  port1.rxMode();
  while (true) {
    if (port1.available()) {
      char c = port1.read();
      if (startsIdentification(c)) {
        readIdentification();
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

void loop() {
  giveOtherSideTimeToGetReady();
  sendReqToIdentify();
  flashLed();
  waitForEndOfTimeSlot();

  scheduleEndOfTimeSlot(endOfTimeSlot);
  waitForIdentification();
  waitForEndOfTimeSlot();
}
