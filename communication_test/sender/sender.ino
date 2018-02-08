// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t sendPin = 0;
const char id = 'b';

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
  char buffer[] = {id, '.', '\n'};
  sendSerial.write(buffer);
  flashLed();
  delay(1000);
}
