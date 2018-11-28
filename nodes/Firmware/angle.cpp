#include "util.h"
#include "id.h"
#include "settings.h"

constexpr uint16_t angleTableSize = 1024;

#define ANGLE_TABLE_FILENAME TOSTRING(angleTables/IDENTITY(ID).h)
#if __has_include(ANGLE_TABLE_FILENAME)
#include ANGLE_TABLE_FILENAME
#else
#include "angleTables/default.h"
#endif

static uint8_t lookedUpAngle(const uint16_t readout) {
  return pgm_read_byte_near(&angleTable[readout]);
}

// Encoding:
//
//   * 0: undefined, i.e. no tilt angle measured
//
//   * [1, 0x7f]: maps to tilt angles in [0, 180°]
uint8_t angleOfThisNode() {
  uint16_t readout = analogRead(accelerometerPin);
  uint8_t angle = lookedUpAngle(readout);
  return angle;
}
