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
  boolean neighborIsParent = false; // fixme: better one type with three
                                    // possible values (parent, child,
                                    // closesLoop)
  boolean neighborClosesLoop = false;
  boolean neighborScheduledLoopCheck = false;
  boolean noResponseLastTime = false;
  char receiveNextChar();
  boolean readPayload(char *, int);
};

#endif
