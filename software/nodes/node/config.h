#ifndef config_h
#define config_h

#include "Arduino.h"

#define DEBUG

const uint8_t ledPin = 13;
const uint8_t pairBufferSize = 10;

#ifdef DEBUG
const boolean flashLedIsEnabled = true; // takes time
const uint32_t announcementPeriod = 2000; // ms
const uint8_t bitDurationExp = 11;
#else
const boolean flashLedIsEnabled = false;
const uint32_t announcementPeriod = 50; // ms (increase for longer tree)
const uint8_t bitDurationExp = 11;
#endif

#endif
