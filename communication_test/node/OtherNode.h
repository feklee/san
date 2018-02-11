#ifndef OtherNode_h
#define OtherNode_h

#include "Arduino.h"

class OtherNode {
 public:
  char nodeId = ' ';
  uint8_t portNumber = 0; // port that other node connects with
  boolean operator==(const OtherNode &);
  boolean operator!=(const OtherNode &);
};

#endif
