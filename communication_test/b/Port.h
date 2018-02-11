#ifndef Port_h
#define Port_h

#include "Arduino.h"
#include <SoftSerial.h>

class Port {
 public:
  Port(int);
  Port *next;
  SoftSerial *serial;
  char receiveNextChar();
  byte digitFromChar(char);
  boolean readPayload(char *, int);
};

#endif
