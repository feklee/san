#include "Arduino.h"
#include "San.h"

void San::flashLed() {
  digitalWrite(ledPin_, HIGH);
  delay(50);
  digitalWrite(ledPin_, LOW);
  delay(50);
}
