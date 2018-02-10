// Tested with Digispark as "Digispark (16 Mhz - No USB)"

#include <SoftSerial.h>
#include <TinyPinChange.h>

const uint8_t ledPin = 1;
const uint8_t portPins[] = {0, 4};
const char nodeId = 'a';
const unsigned long timeSlotDuration = 2000; // ms
const unsigned long graceTime = 100; // time for other node to switch to receive
const int portsCount = 2;

unsigned long endOfTimeSlot = 0; // ms

struct neighbor_t {
  char nodeId;
  byte sourcePort; // port on the neighbor that leads to here (0 - 3)
  boolean isParent;
};

neighbor_t neighbors[1]; // sorted by port

SoftSerial ports[] = {
  SoftSerial(portPins[0], portPins[0]),
  SoftSerial(portPins[1], portPins[1])
};

void setup() {
  for (int i = 0; i < portsCount; i ++) {
    ports[i].begin(4800);
  }
  pinMode(ledPin, OUTPUT);
}

void flashLed() {
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(50);
}

void sendRequest() {
  ports[1].listen();
  ports[1].txMode();
  char buffer[] = {'?', nodeId, '1', '\n', '\0'}; // line break for easy debugging
  ports[1].write(buffer);
  ports[1].rxMode();
}

boolean startsIdentification(char c) {
  return c == '!';
}

char receiveNextChar() {
  while (millis() < endOfTimeSlot) {
    if (ports[1].available()) {
      return ports[1].read();
    }
  }
  return 0;
}

byte digitFromChar(char c) {
  return c - 48;
}

boolean readPayload(char *payload, int expectedPayloadLength) {
  for (int i = 0; i < expectedPayloadLength; i ++) {
    char c = receiveNextChar();
    if (c == 0) {
      return false;
    }
    *payload = c;
    payload ++;
  }
  return true;
}

void readIdentification() {
  char payload[3];
  boolean payloadIsComplete = readPayload(payload, 3);

  if (!payloadIsComplete) {
    return;
  }

  neighbor_t &neighbor = neighbors[1];
  neighbor.nodeId = payload[0];
  neighbor.sourcePort = digitFromChar(payload[1]);
}

void giveOtherSideTimeToGetReady() {
  delay(graceTime);
}

void waitForIdentification() {
  while (millis() < endOfTimeSlot) {
    if (ports[1].available()) {
      char c = ports[1].read();
      if (startsIdentification(c)) {
        readIdentification();
        return;
      }
    }
  }
}

void waitForEndOfTimeSlot() {
  while (millis() < endOfTimeSlot) {
    delay(1);
  }
}

void openNextTimeSlot() {
  if (endOfTimeSlot == 0) {
    endOfTimeSlot = millis() + timeSlotDuration;
  } else {
    endOfTimeSlot += timeSlotDuration;
  }
}

void loop() {
  openNextTimeSlot();
  giveOtherSideTimeToGetReady();
  sendRequest();
  waitForEndOfTimeSlot();

  openNextTimeSlot();
  flashLed();
  flashLed();
  waitForIdentification();
  waitForEndOfTimeSlot();
}
