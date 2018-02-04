const byte outputPin = 3;

void setup() {
  pinMode(outputPin, OUTPUT);

  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
}

void loop() {
  digitalWrite(outputPin, HIGH);
  delay(500);
  digitalWrite(outputPin, LOW);
  delay(500);
}