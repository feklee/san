#include <Adafruit_NeoPixel.h>

#include "id.h"
#include "idUtil.h"

#include "settings.h"
#include "leds.h"

static Adafruit_NeoPixel neoPixel;
static uint8_t currentCompressedColors[4]; // TODO: initialize to actual colors (maybe switch defaults to compressed colors too)

static uint8_t listIndexFromIdOfThisNode() {
  return thisNodeIsRoot()
    ? 0
    : (idOfThisNode - 0x40);
}

static uint8_t adjustForBrightness(uint8_t subColor) {
  return uint32_t(subColor) * ledBrightness / 0xff;
}

static uint32_t neoPixelColor(const byte * const color) {
  return neoPixel.Color(
    adjustForBrightness(color[0]),
    adjustForBrightness(color[1]),
    adjustForBrightness(color[2])
  );
}

// Format of compressed color: RRGGBB (binary)
static uint32_t colorFromCompressedColor(byte c) {
  uint8_t cs[] = {c >> 4, c >> 2, c};
  for (uint8_t i = 0; i < 3; i++) {
    cs[i] = (cs[i] & 3) << 6;
  }
  return neoPixel.Color(cs[0], cs[1], cs[2]);
}

void ledsSetup() {
  const uint8_t numberOfLeds = 4;
  const uint8_t listIndex = listIndexFromIdOfThisNode();
  const uint8_t dataPin = ledDataPin;
  const byte * const * const nodeColors = nodeColorsList[listIndex];
  const uint32_t colorOfTopHemisphere = neoPixelColor(nodeColors[0]);
  const uint32_t colorOfBottomHemisphere = neoPixelColor(nodeColors[1]);

  neoPixel = Adafruit_NeoPixel(numberOfLeds, dataPin,
                               NEO_RGB + NEO_KHZ800);
  neoPixel.begin();
  neoPixel.setPixelColor(0, colorOfTopHemisphere);
  neoPixel.setPixelColor(1, colorOfTopHemisphere);
  neoPixel.setPixelColor(2, colorOfBottomHemisphere);
  neoPixel.setPixelColor(3, colorOfBottomHemisphere);
  neoPixel.show();
}

void updateLedColors(byte compressedColors[4]) {
  bool colorsHaveNotChanged =
    memcmp(compressedColors, currentCompressedColors, 4) == 0;
  if (colorsHaveNotChanged) {
    Serial.println("Colors haven't changed"); // TODO
    return;
  }
  Serial.println("Colors have changed"); // TODO
  for (uint8_t i = 0; i < 4; i++) {
    neoPixel.setPixelColor(i, colorFromCompressedColor(compressedColors[i]));
  }
  neoPixel.show();
  memcpy(currentCompressedColors, compressedColors, 4);
}
