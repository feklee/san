// Tested with Digispark as follows.

// Digispark (16 Mhz - No USB): Receiver gets garbage characters.

// Digispark (8 Mhz - No USB): Receiver gets garbage characters.

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t rxPin = 0;
const uint8_t txPin = 2;

SoftSerial mySerial(rxPin, txPin); // RX, TX

void setup() {
  mySerial.begin(4800);
  pinMode(ledPin, OUTPUT);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
}

void loop() {
  mySerial.write("Hi!");
  flashLed();
  delay(1000);
}
