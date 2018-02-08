// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t sendPin = 0;

SoftSerial sendSerial(sendPin, sendPin);

void setup() {
  sendSerial.begin(4800);
  sendSerial.txMode();
  pinMode(ledPin, OUTPUT);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(50);
}

void loop() {
  sendSerial.write("Hi!\n");
  flashLed();
  delay(1000);
}
