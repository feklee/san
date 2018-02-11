#ifndef timeslot_h
#define timeslot_h

#include "Arduino.h"

void openNextTimeSlot();
void openTimeSlotStartingAt(unsigned long);
void giveOtherSideTimeToGetReady();
boolean timeSlotHasEnded();
void waitForEndOfTimeSlot();

#endif
