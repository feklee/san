#ifndef pairMessageQueue_h
#define pairMessageQueue_h

#include "Arduino.h"

void enqueuePairMessage(const char *);
const char *dequeuePairMessage();
void clearPairMessageQueue();
uint8_t numberOfQueuedPairMessages();

#endif
