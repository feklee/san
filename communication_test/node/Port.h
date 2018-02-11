#ifndef Port_h
#define Port_h

#include "Arduino.h"
#include <SoftSerial.h>

class Port {
 public:
  Port(uint8_t, uint8_t);
  Port *next;
  SoftSerial *serial;
  uint8_t id;
  char receiveNextChar();
  boolean readPayload(char *, int);
};

#endif
