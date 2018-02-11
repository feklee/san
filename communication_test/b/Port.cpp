#include "Port.h"
#include "timeslot.h"

Port::Port(int pin) {
  serial = new SoftSerial(pin, pin);
}

char Port::receiveNextChar() {
  while (timeSlotHasEnded()) {
    if (serial->available()) {
      return serial->read();
    }
  }
  return 0;
}

byte Port::digitFromChar(char c) {
  return c - 48;
}

boolean Port::readPayload(char *payload, int expectedPayloadLength) {
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
