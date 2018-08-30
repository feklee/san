#ifndef Port_h
#define Port_h

#include "Arduino.h"
#include "OtherNode.h"
#include "timeslot.h"

#include <MultiTrans.h>

static const uint8_t bitDurationExp = 14; // TODO: try faster
static const uint8_t maxNumberOfCharsPerTransmission = 8;
using MT = MultiTrans<bitDurationExp, maxNumberOfCharsPerTransmission>;
MT multiTransceiver;

enum neighborType {
  parent, child, closesLoop, none
};

template <uint8_t t>
class Port {
  static const uint8_t pinNumber = t;
  
public:
  Port(uint8_t);
  MT::Transceiver<pinNumber> transceiver;

  uint8_t number;

  OtherNode neighbor;
  enum neighborType neighborType = none;
  boolean noResponseLastTime = false;

  char receiveNextChar(boolean = true);
  boolean readPayload(char *, int, boolean = true);
};

template <uint8_t t>
Port<t>::Port(uint8_t number) {
  this->number = number;
}

template <uint8_t t>
char Port<t>::receiveNextChar(boolean fixmeTimeSlot) {
  if (fixmeTimeSlot) {
    while (!timeSlotHasEnded()) {
      char c = transceiver.getNextCharacter();
      if (c) {
        return c;
      }
    }
  } else {
    while (!overlappingCycleHasEnded()) {
      char c = transceiver.getNextCharacter();
      if (c) {
        return c;
      }
    }
  }
  return 0;
}

template <uint8_t t>
boolean Port<t>::readPayload(char *payload, int expectedPayloadLength,
                             boolean fixmeTimeSlot) {
  for (int i = 0; i < expectedPayloadLength; i ++) {
    char c = receiveNextChar(fixmeTimeSlot);
    if (c == 0) {
      return false;
    }
    *payload = c;
    payload ++;
  }
  return true;
}

#endif
