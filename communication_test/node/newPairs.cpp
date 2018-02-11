#include "newPairs.h"

static const uint8_t bufferSize = 10;
static uint8_t first = 0;
static uint8_t last = 0;
static uint8_t length = 0;
static Pair buffer[bufferSize];

static void incrementPosition(uint8_t &position) {
  position = (position + 1) % bufferSize;
}

static void decrementLength() {
  length = (length > 0) ? length - 1 : 0;
}

void enqueueNewPair(Pair pair) {
  buffer[last] = pair;
  incrementPosition(last);

  if (length < bufferSize) {
    length ++;
  } else {
    incrementPosition(first);
  }
}

Pair dequeueNewPair() {
  if (length == 0) {
    return emptyPair;
  }

  Pair pair = buffer[first];
  incrementPosition(first);
  decrementLength();
  return pair;
}
