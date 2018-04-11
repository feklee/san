#ifndef newPairs_h
#define newPairs_h

#include "Arduino.h"
#include "Pair.h"

void enqueueNewPair(Pair);
Pair dequeueNewPair();

#endif
