#include "Port.h"
#include "timeslot.h"

Port::Port(uint8_t pin, uint8_t id) {
  serial = new SoftSerial(pin, pin);
  this->id = id;
}

char Port::receiveNextChar() {
  while (timeSlotHasEnded()) {
    if (serial->available()) {
      return serial->read();
    }
  }
  return 0;
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
