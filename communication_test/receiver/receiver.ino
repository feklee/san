// Tested with Digispark @16.5/16/8 Mhz

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t txRxPin = 0;

SoftSerial mySerial(txRxPin, txRxPin); // RX, TX

void setup() {
  mySerial.begin(4800);
  mySerial.rxMode();
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
}

void loop() {
  if (mySerial.available()) {
    mySerial.read();
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }
  delay(300);
}
