#ifndef San_h
#define San_h

#include "Arduino.h"
#include <SoftSerial.h>

class San {
  const uint8_t ledPin_ = 1;
  unsigned long endOfTimeSlot_ = 0; // ms
  const unsigned long timeSlotDuration_ = 2000; // ms
  uint8_t portPins_[2];

  char receiveNextChar(); 
  boolean timeSlotNotExceeded();

public:
  SoftSerial *ports[2];

  San();
  void flashLed();
  boolean readPayload(char *, int);
  byte digitFromChar(char);
  boolean timeSlotHasEnded();
  void waitForEndOfTimeSlot();
  void openNextTimeSlot();
};

#endif
