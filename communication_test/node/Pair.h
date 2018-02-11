#ifndef Pair_h
#define Pair_h

#include "Arduino.h"
#include "OtherNode.h"

class Pair {
 public:
  Pair(OtherNode = emptyOtherNode, OtherNode = emptyOtherNode);
  OtherNode firstNode;
  OtherNode secondNode;
};

const Pair emptyPair;

#endif
