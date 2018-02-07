// Tested with Teensy 3.2

const uint8_t ledPin = 13;

void setup() {
  Serial.begin(9600);
  Serial1.begin(4800);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
}

void loop() {
  char c;

  if (Serial1.available()) {
    c = Serial1.read();
    Serial.print(c);
    flashLed();
  }
}
