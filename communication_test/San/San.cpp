#include "Arduino.h"
#include "San.h"

San::San() {
  portPins_[0] = 0;
  portPins_[1] = 4;
  ports[0] = new SoftSerial(portPins_[0], portPins_[0]);
  ports[1] = new SoftSerial(portPins_[1], portPins_[1]);
}

void San::flashLed() {
  digitalWrite(ledPin_, HIGH);
  delay(50);
  digitalWrite(ledPin_, LOW);
  delay(50);
}

boolean San::timeSlotHasEnded() {
  return millis() >= endOfTimeSlot_;
}

void San::waitForEndOfTimeSlot() {
  while (millis() < endOfTimeSlot_) {
    delay(1);
  }
}

void San::openNextTimeSlot() {
  if (endOfTimeSlot_ == 0) {
    endOfTimeSlot_ = millis() + timeSlotDuration_;
  } else {
    endOfTimeSlot_ += timeSlotDuration_;
  }
}

char San::receiveNextChar() {
  while (timeSlotHasEnded()) {
    if (ports[1]->available()) {
      return ports[1]->read();
    }
  }
  return 0;
}

byte San::digitFromChar(char c) {
  return c - 48;
}

boolean San::readPayload(char *payload, int expectedPayloadLength) {
  for (int i = 0; i < expectedPayloadLength; i ++) {
    char c = receiveNextChar();
    if (c == 0) {
      return false;
    }
    *payload = c;
    payload ++;
  }
  return true;
}
