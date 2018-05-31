#include <Adafruit_NeoPixel.h>

void setup() {
  const uint8_t ledPin = 2;
  const uint8_t brightness = 40; // Avoid exceeding the Arduino's power supply
  Adafruit_NeoPixel neoPixel = Adafruit_NeoPixel(1, ledPin,
                                                 NEO_RGB + NEO_KHZ800);

  neoPixel.begin();
  neoPixel.setPixelColor(0, neoPixel.Color(brightness, brightness, brightness));
  neoPixel.show();
}

void loop() {}
