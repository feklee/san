#include "timeslot.h"
#include "config.h"

static unsigned long endOfTimeSlot = 0; // ms
static unsigned long endOfOverlappingCycle = 0; // ms
static unsigned long endOfCycle = 0; // ms
static const unsigned long timeForPortCommunication = 2 * timeSlotDuration;
static const unsigned long cycleDuration =
  portsCount * timeForPortCommunication;

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

void pauseForOneTimeSlot() {
  openNextTimeSlot();
  waitForEndOfTimeSlot();
}

void startOverlappingCycle() {
  const unsigned long timeForPortCommunication = 2 * timeSlotDuration;
  const unsigned long cycleDuration = portsCount * timeForPortCommunication;
  const unsigned long padding = timeSlotDuration;
  endOfOverlappingCycle = millis() + cycleDuration + padding;
}

boolean overlappingCycleHasEnded() {
  return millis() >= endOfOverlappingCycle;
}

static unsigned long startOfNextTimeSlot() {
  return endOfTimeSlot;
}

void startCycleWithNextTimeSlot() {
  endOfCycle = startOfNextTimeSlot() + cycleDuration;
}

static void syncTimeSlotToCycle() {
  endOfTimeSlot = endOfCycle;
}

void waitForEndOfCycle() {
  while (millis() < endOfCycle) {
    delay(1);
  }
  syncTimeSlotToCycle();
}
