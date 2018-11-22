#ifndef pairMessageQueue_h
#define pairMessageQueue_h

#include "Arduino.h"

void enqueuePairMessage(const byte *);
const byte *dequeuePairMessage();
void clearPairMessageQueue();
uint8_t numberOfQueuedPairMessages();

#endif
