#include "newPairs.h"

static const uint8_t size = 10;
static uint8_t start;
static uint8_t end;
static uint8_t isEmpty = true;
static Pair buffer[size];

void incrementPosition(uint8_t &position) {
  position = (position + 1) % size;
}

void enqueueNewPair(Pair pair) {
  if (isEmpty) {
    start = end = 0;
    isEmpty = false;
  } else {
    incrementPosition(end);
  }
  buffer[end] = pair;
}

boolean dequeueNewPair(Pair &pair) {
  if (isEmpty) {
    return false;
  }

  pair = buffer[start];
  if (start == end) {
    isEmpty = true;
  } else {
    incrementPosition(start);
  }
}
