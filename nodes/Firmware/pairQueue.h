#ifndef newPairs_h
#define newPairs_h

#include "Arduino.h"
#include "Pair.h"

void enqueuePair(Pair);
Pair dequeuePair();
void clearPairQueue();
uint8_t numberOfQueuedPairs();

#endif
