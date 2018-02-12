#ifndef OtherNode_h
#define OtherNode_h

#include "Arduino.h"

class OtherNode {
 public:
  OtherNode(char = ' ', uint8_t = 0);
  char nodeId;
  uint8_t portNumber; // port that other node connects with
  boolean operator==(const OtherNode &);
  boolean operator!=(const OtherNode &);
  boolean isEmpty();
};

const OtherNode emptyOtherNode;

#endif
