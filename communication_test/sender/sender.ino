// Tested with Digispark @16.5/16/8 Mhz

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t txRxPin = 0;

SoftSerial mySerial(txRxPin, txRxPin); // RX, TX

void setup() {
  mySerial.begin(4800);
  mySerial.txMode();
  pinMode(ledPin, OUTPUT);
}

void loop() {
  mySerial.write("Hi!");
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
  delay(100);
  digitalWrite(ledPin, HIGH);
}
