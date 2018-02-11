#include "timeslot.h"

// fixme: make all values configurable in a `config.h', also the flashing, and
// make it possibly dependent on presence of DEBUG.

static unsigned long endOfTimeSlot = 0; // ms
static const unsigned long timeSlotDuration = 2000; // ms
static const unsigned long graceTime =
  100; // time for other node to switch to receive / ms

void openNextTimeSlot() {
  if (endOfTimeSlot == 0) {
    endOfTimeSlot = millis() + timeSlotDuration;
  } else {
    endOfTimeSlot += timeSlotDuration;
  }
}

void openTimeSlotStartingAt(unsigned long time) {
  endOfTimeSlot = time + timeSlotDuration;
}

void giveOtherSideTimeToGetReady() {
  delay(graceTime);
}

boolean timeSlotHasEnded() {
  return millis() >= endOfTimeSlot;
}

void waitForEndOfTimeSlot() {
  while (millis() < endOfTimeSlot) {
    delay(1);
  }
}
