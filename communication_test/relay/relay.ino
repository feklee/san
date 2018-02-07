// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t receivePin = 4;
const uint8_t sendPin = 0;

SoftSerial receiveSerial(receivePin, receivePin);
SoftSerial sendSerial(sendPin, sendPin);

void setup() {
  receiveSerial.begin(4800);
  receiveSerial.rxMode();
  sendSerial.begin(4800);
  sendSerial.txMode();
  receiveSerial.listen();
  pinMode(ledPin, OUTPUT);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
}

void loop() {
  if (receiveSerial.available()) {
    char c = receiveSerial.read();
    sendSerial.write(c);
    flashLed();
    delay(100);
  }
}
