#pragma once

#include "Arduino.h"

void enqueuePairMessage(const byte *);
const byte *dequeuePairMessage();
void clearPairMessageQueue();
uint8_t numberOfQueuedPairMessages();
