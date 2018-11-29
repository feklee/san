const uint8_t accelerometerPin = A0;

uint16_t minReadout, maxReadout;
const unsigned long printInterval = 500; // ms

void setup() {
  analogReference(EXTERNAL);
  Serial.begin(9600);
  reset();
}

float acceleration(const uint16_t readout) { // g
  // Based on experimentation, trimming mitigates issues with singularities and
  // low angular resolution at the poles:
  float trimValue = 1;
  float trimmedMinReadout = minReadout + trimValue;
  float trimmedMaxReadout = maxReadout - trimValue;

  float readoutPerG = float(trimmedMaxReadout - trimmedMinReadout) / 2;
  float zeroGReadout = trimmedMinReadout + readoutPerG;
  return (float(readout) - zeroGReadout) / readoutPerG;
}

float angle(uint16_t readout) { // deg
  float acc = acceleration(readout);
  float clippedAcc = min(1, max(-1, acc)); // [-1, 1]
  return acos(clippedAcc) * 360 / 2 / PI;
}

// [0, 180] -> [1, 127] (0 excluded, because that means: no angle)
uint16_t encodedAngle(uint16_t readout) {
  float a = angle(readout);
  return round(a * 126 / 180) % 127 + 1;
}

void printAngleTable() {
  uint16_t readout = 0;
  for (uint8_t row = 0; row < 128; row ++) {
    for (uint8_t column = 0; column < 8; column ++) {
      Serial.print("0x");
      Serial.print(encodedAngle(readout), HEX);
      Serial.print(readout < 1023 ? "," : "");
      Serial.print(column < 7 ? " " : "");
      readout ++;
    }
    Serial.println();
  }
}

void printStatus(uint16_t lastReadout) {
  char s[5];
  Serial.print("last readout = ");
  sprintf(s, "%4d", lastReadout);
  Serial.print(s);
  Serial.print(", min. readout = ");
  sprintf(s, "%4d", minReadout);
  Serial.print(s);
  Serial.print(", max. readout = ");
  sprintf(s, "%4d", maxReadout);
  Serial.print(s);
  Serial.println(" (send: `t` to print table, `r` to reset)");
}

uint16_t measure() {
  uint16_t readout = analogRead(accelerometerPin);
  minReadout = min(readout, minReadout);
  maxReadout = max(readout, maxReadout);
  return readout;
}

void reset() {
  minReadout = 0xffff;
  maxReadout = 0;
}

void iterate() {
  static unsigned long scheduledPrintTime = millis();
  uint16_t readout = measure();
  unsigned long currentTime = millis();
  if (currentTime >= scheduledPrintTime) {
    printStatus(readout);
    scheduledPrintTime = currentTime + printInterval;
  }
}

void loop() {
  static bool finished = false;

  while (Serial.available() > 0) {
    char c = Serial.read();
    switch (c) {
    case 't':
      printAngleTable();
      finished = true;
      break;
    case 'r':
      reset();
      finished = false;
      break;
    }
  }

  if (!finished) {
    iterate();
  }
}
