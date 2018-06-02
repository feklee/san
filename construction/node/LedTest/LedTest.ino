#include <Adafruit_NeoPixel.h>

static const uint8_t brightness = 20; // avoid exceeding the Arduino's power
                                      // supply
static const uint8_t numberOfLeds = 4;
Adafruit_NeoPixel neoPixel;

void setup() {
  const uint8_t dataPin = A0; // connected to pin at round edge of LED

  neoPixel = Adafruit_NeoPixel(numberOfLeds, dataPin, NEO_RGB + NEO_KHZ800);
  neoPixel.begin();
}

uint32_t white() { // to check if all sub pixels are OK
  return neoPixel.Color(brightness / 3, brightness / 3, brightness / 3);
}

uint32_t colored(uint8_t i) { // to check if LEDs are wired correctly
  switch (i) {
  case 0:
    return neoPixel.Color(brightness, 0, 0);
  case 1:
    return neoPixel.Color(0, brightness, 0);
  case 2:
    return neoPixel.Color(0, 0, brightness);
  default:
    return neoPixel.Color(brightness / 2, brightness / 2, 0);
  }
}

void loop() {
  const uint32_t delayDuration = 1000; // ms

#if 0
  for (uint8_t i = 0; i < numberOfLeds; i ++) {
    neoPixel.setPixelColor(i, white());
  }
  neoPixel.show();
  delay(delayDuration);
#endif

  for (uint8_t i = 0; i < numberOfLeds; i ++) {
    neoPixel.setPixelColor(i, colored(i));
  }
  neoPixel.show();
  delay(delayDuration);
}
