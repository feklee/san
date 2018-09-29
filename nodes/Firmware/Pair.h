#ifndef Pair_h
#define Pair_h

#include "Arduino.h"
#include "Port.h"

struct Pair {
  Port parentPort;
  Port childPort;
};

#endif
