// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t receivePin = 4;
const uint8_t sendPin = 0;
const int maxBufferSize = 8;
char buffer[maxBufferSize];
int bufferSize = 0;

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
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(50);
}

void flushBuffer() {
  for (int i = 0; i < bufferSize; i ++) {
    sendSerial.write(buffer[i]);
  }
  bufferSize = 0;
}

void appendToBuffer(char c) {
  buffer[bufferSize] = c;
  bufferSize ++;
  bufferSize %= maxBufferSize;
}

void loop() {
  if (receiveSerial.available()) {
    char c = receiveSerial.read();
    appendToBuffer(c);
    if (c == '\n') { // end of package received?
      flushBuffer();
      flashLed();
    }
  }
}
