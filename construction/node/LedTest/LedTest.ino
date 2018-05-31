#include <Adafruit_NeoPixel.h>

void setup() {
  const uint8_t dataPin = 10; // connected to pin at round edge of LED
  const uint8_t brightness = 20; // avoid exceeding the Arduino's power supply
  Adafruit_NeoPixel neoPixel = Adafruit_NeoPixel(1, dataPin,
                                                 NEO_RGB + NEO_KHZ800);

  neoPixel.begin();
  neoPixel.setPixelColor(0, neoPixel.Color(brightness, brightness, brightness));
  neoPixel.show();
}

void loop() {}
