#include "timeslot.h"
#include "config.h"

static unsigned long endOfTimeSlot = 0; // ms
static unsigned long endOfOverlappingCycle = 0; // ms

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

void openOverlappingCycle() {
  const unsigned long timeForPortCommunication = 2 * timeSlotDuration;
  const unsigned long cycleDuration = portsCount * timeForPortCommunication;
  const unsigned long padding = timeSlotDuration;
  endOfOverlappingCycle = millis() + cycleDuration + padding;
}

boolean overlappingCycleHasEnded() {
  return millis() >= endOfOverlappingCycle;
}
