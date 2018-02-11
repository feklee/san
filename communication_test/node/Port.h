#ifndef Port_h
#define Port_h

#include "Arduino.h"
#include "OtherNode.h"
#include <SoftSerial.h>

class Port {
 public:
  Port(uint8_t, uint8_t);
  Port *next;
  SoftSerial *serial;
  uint8_t number;
  OtherNode neighbor;
  boolean connectsToParent = false;
  char receiveNextChar();
  boolean readPayload(char *, int);
};

#endif
