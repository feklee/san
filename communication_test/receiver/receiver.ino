#include "DigiKeyboard.h"

int sensorValue = 0;

void setup() {
  pinMode(0, INPUT);
  Serial.begin(9600);
}

void loop() {
  DigiKeyboard.sendKeyStroke(0);
  DigiKeyboard.println(digitalRead(0));
  DigiKeyboard.delay(1000);
}
