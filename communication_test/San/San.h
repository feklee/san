#ifndef San_h
#define San_h

#include "Arduino.h"
#include <SoftSerial.h>

class San {
  const uint8_t ledPin_ = 1;

public:
  void flashLed();
};

#endif
