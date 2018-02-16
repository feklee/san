#ifndef Port_h
#define Port_h

#include "Arduino.h"
#include "OtherNode.h"
#include <SoftSerial.h>

enum neighborType {
  parent, child, closesLoop, none
};

class Port {
public:
  Port(uint8_t, uint8_t);
  Port *next;
  SoftSerial *serial;
  uint8_t number;

  OtherNode neighbor;
  enum neighborType neighborType = none;
  boolean noResponseLastTime = false;

  char receiveNextChar(boolean = true);
  boolean readPayload(char *, int, boolean = true);
};

#endif
