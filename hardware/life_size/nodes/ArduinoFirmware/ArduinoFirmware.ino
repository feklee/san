// Basic algorithm idea: Parent nodes announce themselves. When a node sees the
// announcement of a parent, it creates a pair with the announcing node and
// itself and sends that via SPI.

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

#include "id.h" // ID of this node, e.g.: `#define ID A` (no quotes!)

#include "util.h"
#include "settings.h"
#include "TransceiverOnPort.h"
#include "Port.h"
#include "Pair.h"
#include "message.h"
#include "pairMessageQueue.h"

Adafruit_NeoPixel neoPixel;

constexpr char idOfThisNode = TOSTRING(ID)[0];
static TransceiverOnPort<rxPinNumberOfPort1, txPinNumberOfPort1, 1>
  transceiverOnPort1;
static TransceiverOnPort<rxPinNumberOfPort2, txPinNumberOfPort2, 2>
  transceiverOnPort2;
static TransceiverOnPort<rxPinNumberOfPort3, txPinNumberOfPort3, 3>
  transceiverOnPort3;
static TransceiverOnPort<rxPinNumberOfPort4, txPinNumberOfPort4, 4>
  transceiverOnPort4;
static uint8_t numberOfPortWithParent = 0; // 0 = no parent

static uint32_t parentExpiryTime = 0; // ms

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
  digitalWrite(13, HIGH); // during boot, the ESP-EYE CLK pin needs to be kept
                          // high or unconnected
  delay(bootDelay);
  ledSetup();

  SPI.begin();
  SPI.setDataMode(SPI_MODE3);
}

void sendMyIdViaSpi() {
  // With DMA enabled, the ESP32 SPI driver wants to receive multiples of 32
  // bits:
  const char message[] = {'I', 'D', '=', idOfThisNode, '\0'};

  digitalWrite(SS, LOW);

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 4; j++) {
      char c = message[j];
      SPI.transfer(c);
    }
  }
  SPI.transfer('\0');

  digitalWrite(SS, HIGH);
}

void periodicallySendMyIdViaSpi() {
  static uint32_t scheduledSendTime = millis() + idSendPeriod; // ms
  uint32_t now = millis(); // ms

  if (now >= scheduledSendTime) {
    sendMyIdViaSpi();
    scheduledSendTime = now + idSendPeriod;
  }
}

void loop(void) {
  periodicallySendMyIdViaSpi();
}
