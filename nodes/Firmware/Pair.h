#ifndef Pair_h
#define Pair_h

#include "Arduino.h"
#include "OtherNode.h"

struct Pair {
  OtherNode firstNode; // TODO: better parentPort, childPort?
  OtherNode secondNode;
};

#endif
