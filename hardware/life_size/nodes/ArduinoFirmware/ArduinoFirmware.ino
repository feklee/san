// Pins on 328P:
//
//   * 10: SS (slave select)
//
//   * 11: MOSI (master out, slave in)
//
//   * 12: MISO (not used here)
//
//   * 13: SCK (clock)

#include <SPI.h>
#include <Adafruit_NeoPixel.h>
#include "settings.h"

Adafruit_NeoPixel neoPixel;

constexpr char idOfThisNode = 'R';

uint8_t adjustForBrightness(uint8_t subColor) {
  return uint32_t(subColor) * ledBrightness / 0xff;
}

uint32_t neoPixelColor(const byte * const color) {
  return neoPixel.Color(
    adjustForBrightness(color[0]),
    adjustForBrightness(color[1]),
    adjustForBrightness(color[2])
  );
}

static inline bool thisNodeIsRoot() {
  return idOfThisNode == '^';
}

uint8_t listIndexFromIdOfThisNode() {
  return thisNodeIsRoot()
    ? 0
    : (idOfThisNode - 0x40);
}

void ledSetup() {
  const uint8_t numberOfLeds = 4;
  const uint8_t listIndex = listIndexFromIdOfThisNode();
  const byte * const * const nodeColors = nodeColorsList[listIndex];
  const uint32_t colorOfTopHemisphere = neoPixelColor(nodeColors[0]);
  const uint32_t colorOfBottomHemisphere = neoPixelColor(nodeColors[1]);

  neoPixel = Adafruit_NeoPixel(numberOfLeds, ledDataPin,
                               NEO_RGB + NEO_KHZ800);
  neoPixel.begin();
  neoPixel.setPixelColor(0, colorOfTopHemisphere);
  neoPixel.setPixelColor(1, colorOfTopHemisphere);
  neoPixel.setPixelColor(2, colorOfBottomHemisphere);
  neoPixel.setPixelColor(3, colorOfBottomHemisphere);
  neoPixel.show();
}

void setup(void) {
  digitalWrite(13, HIGH);
  delay(5000); // wait for ESP-EYE to boot

  ledSetup();

  SPI.begin();
  SPI.setDataMode(SPI_MODE3);
//  SPI.setClockDivider(SPI_CLOCK_DIV4);
}

void loop(void) {
  const char * const message = "Hello, world"; // multiple of 32bit

  digitalWrite(SS, LOW);
  for (char *c = message; *c != '\0'; c++) {
    SPI.transfer(*c);
  }
  digitalWrite(SS, HIGH);

  delay(1000);
}
