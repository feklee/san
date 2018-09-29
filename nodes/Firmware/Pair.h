#ifndef Pair_h
#define Pair_h

#include "Arduino.h"
#include "Port.h"

struct Pair {
  Port firstNode; // TODO: better parentPort, childPort?
  Port secondNode;
};

#endif
