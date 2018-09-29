#include "pairMessageQueue.h"
#include "settings.h"

static uint8_t first = 0;
static uint8_t last = 0;
static uint8_t length = 0;
static char buffer[maxPairMessageQueueSize][4];

static void incrementPosition(uint8_t &position) {
  position = (position + 1) % maxPairMessageQueueSize;
}

static void decrementLength() {
  length = (length > 0) ? length - 1 : 0;
}

void enqueuePairMessage(const char *pairMessage) {
  strcpy(buffer[last], pairMessage);
  incrementPosition(last);

  if (length < maxPairMessageQueueSize) {
    length ++;
  } else {
    incrementPosition(first);
  }
}

// don't call when queue is empty
const char *dequeuePairMessage() {
  const char *pairMessage = buffer[first];
  incrementPosition(first);
  decrementLength();
  return pairMessage;
}

void clearPairMessageQueue() {
  first = 0;
  last = 0;
  length = 0;
}

uint8_t numberOfQueuedPairMessages() {
  return length;
}
