#ifndef config_h
#define config_h

#include "Arduino.h"

#define DEBUG

const uint8_t ledPin = 1;
const uint8_t portsCount = 2;
const uint8_t portPins[portsCount] = {0, 4};
const unsigned long graceTime = 100; // time for other node to switch to receive
const unsigned long timeSlotDuration = 500; // ms

#ifdef DEBUG
const boolean flashLedIsEnabled = true; // takes time
#else
const boolean flashLedIsEnabled = false;
#endif

#endif
