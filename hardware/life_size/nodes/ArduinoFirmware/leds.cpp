#include <Adafruit_NeoPixel.h>

#include "id.h"
#include "idUtil.h"

#include "settings.h"
#include "leds.h"

static Adafruit_NeoPixel neoPixel;
static uint8_t currentCompressedColors[4] = {0, 0, 0, 0};

static uint8_t listIndexFromIdOfThisNode() {
  return thisNodeIsRoot()
    ? 0
    : (idOfThisNode - 0x40);
}

static uint8_t adjustForBrightness(uint8_t subColor) {
  return uint32_t(subColor) * ledBrightness / 0xff;
}

// Format of compressed color: RRGGBB (binary)
static uint32_t colorFromCompressedColor(byte c) {
  byte components[] = {c >> 4, c >> 2, c};
  for (uint8_t i = 0; i < 3; i++) {
    byte uncompressedComponent = (components[i] & 3) << 6;
    byte adjustedComponent = adjustForBrightness(uncompressedComponent);
    components[i] = adjustedComponent;
  }
  return neoPixel.Color(components[0], components[1], components[2]);
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

void ledsSetup() {
  const uint8_t numberOfLeds = 4;
  const uint8_t listIndex = listIndexFromIdOfThisNode();
  const uint8_t dataPin = ledDataPin;
  const byte * const nodeColors = nodeColorsList[listIndex];
  const uint32_t compressedColorOfTopHemisphere = nodeColors[0];
  const uint32_t compressedColorOfBotHemisphere = nodeColors[1];

  neoPixel = Adafruit_NeoPixel(numberOfLeds, dataPin, NEO_RGB + NEO_KHZ800);
  neoPixel.begin();

  byte compressedColors[] = {compressedColorOfTopHemisphere,
                             compressedColorOfTopHemisphere,
                             compressedColorOfBotHemisphere,
                             compressedColorOfBotHemisphere};
  updateLedColors(compressedColors);
}
