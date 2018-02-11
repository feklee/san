#ifndef newPairs_h
#define newPairs_h

#include "Arduino.h"
#include "Pair.h"

void enqueueNewPair(Pair pair);
boolean dequeueNewPair(Pair &pair);

#endif
