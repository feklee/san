// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t rxTxPin = 0;

SoftSerial mySerial(rxTxPin, rxTxPin); // RX, TX

void setup() {
  mySerial.begin(4800);
  mySerial.txMode();
  pinMode(ledPin, OUTPUT);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
}

void loop() {
  mySerial.write("Hi!\n");
  flashLed();
  delay(1000);
}
