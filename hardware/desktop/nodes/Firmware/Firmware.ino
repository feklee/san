// Tested with Arduino Pro Mini

// Basic algorithm idea: Parent nodes announce themselves. When a node
// sees the announcement of a parent, it creates a pair with the
// announcing node and itself. Pairs are propagated up to the root
// node.

#include "id.h" // ID of this node, e.g.: `#define ID A` (no quotes!)
#include "idUtil.h"

#include "settings.h"
#include "TransceiverOnPort.h"
#include "Port.h"
#include "Pair.h"
#include "message.h"
#include "pairMessageQueue.h"
#include "angle.h"
#include "leds.h"

static TransceiverOnPort<pinNumberOfPort1, 1> transceiverOnPort1;
static TransceiverOnPort<pinNumberOfPort2, 2> transceiverOnPort2;
static TransceiverOnPort<pinNumberOfPort3, 3> transceiverOnPort3;
static TransceiverOnPort<pinNumberOfPort4, 4> transceiverOnPort4;
static uint8_t numberOfPortWithParent = 0; // 0 = no parent

static uint32_t parentExpiryTime = 0; // ms

ISR(TIMER2_COMPA_vect) {
  transceiverOnPort1.transceiver.handleTimer2Interrupt();
  transceiverOnPort2.transceiver.handleTimer2Interrupt();
  transceiverOnPort3.transceiver.handleTimer2Interrupt();
  transceiverOnPort4.transceiver.handleTimer2Interrupt();
}

ISR(PCINT2_vect) { // D0-D7
  transceiverOnPort1.transceiver.handlePinChangeInterrupt();
  transceiverOnPort2.transceiver.handlePinChangeInterrupt();
}

ISR(PCINT0_vect) { // D8-D13
  transceiverOnPort3.transceiver.handlePinChangeInterrupt();
  transceiverOnPort4.transceiver.handlePinChangeInterrupt();
}

void accelerometerSetup() {
  analogReference(EXTERNAL);
}

void setup() {
  ledsSetup();
  accelerometerSetup(); 

  pinMode(ledPin, OUTPUT);
  flashLed();

  if (thisNodeIsRoot()) {
    Serial.begin(115200);
  }

  setupMultiTransceiver();
}

bool iHaveAParent() {
  return numberOfPortWithParent != 0;
}

void loop() {
  if (thisNodeIsRoot()) {
    rootLoop();
  } else {
    nonRootLoop();
  }
}

char hexDigit(
  uint8_t digit // in [0, 16)
) {
  return digit < 10 ? digit + 0x30 : digit + 0x37;
}

void angleToHex(uint8_t angle, char * const hex) {
  hex[0] = hexDigit(angle / 16);
  hex[1] = hexDigit(angle & 0xf);
}

void printPair(const Pair &pair) {
  char angleInHex[2];
  angleToHex(pair.childAngle, angleInHex);

  char buffer[] = {
                   pair.parentPort.nodeId,
                   charFromDigit(pair.parentPort.portNumber),
                   pair.childPort.nodeId,
                   charFromDigit(pair.childPort.portNumber),
                   angleInHex[0],
                   angleInHex[1],
                   '\0'
  };

  Serial.println(buffer);
}

void rootLoop() {
  parseMessage(transceiverOnPort1, transceiverOnPort1.getMessage());

  if (numberOfQueuedPairMessages() > 0) {
    const byte *pairMessage = dequeuePairMessage();
    Pair pair = pairFromPairMessage(pairMessage);
    printPair(pair);
  }

  periodicallyAnnounceMe();
}

void parseMessages() {
  bool messageHasBeenReceived;

  do {
    messageHasBeenReceived = false;
    messageHasBeenReceived |= 
      parseMessage(transceiverOnPort1, transceiverOnPort1.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort2, transceiverOnPort2.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort3, transceiverOnPort3.getMessage());
    messageHasBeenReceived |=
      parseMessage(transceiverOnPort4, transceiverOnPort4.getMessage());
  } while (messageHasBeenReceived);
}

void nonRootLoop() {
  parseMessages();

  if (!iHaveAParent()) {
    clearPairMessageQueue();
    return;
  }

  if (!transmissionToParentIsInProgress()) {
    if (numberOfQueuedPairMessages() > 0) {
      sendPairMessageToParent(dequeuePairMessage());
    }
  }
  periodicallyAnnounceMe();
  removeParentIfExpired();
}

bool transmissionToParentIsInProgress() {
  if (numberOfPortWithParent == transceiverOnPort1.portNumber) {
    return transceiverOnPort1.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort2.portNumber) {
    return transceiverOnPort2.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort3.portNumber) {
    return transceiverOnPort3.transceiver.transmissionIsInProgress();
  }
  if (numberOfPortWithParent == transceiverOnPort4.portNumber) {
    return transceiverOnPort4.transceiver.transmissionIsInProgress();
  }
  return false;
}

void removeParent() {
  numberOfPortWithParent = 0;
}

void removeParentIfExpired() {
  if (iHaveAParent() && millis() > parentExpiryTime) {
    removeParent();
  }
}

void periodicallyAnnounceMe() {
  static uint32_t scheduledAnnouncementTime =
    millis() + announcementPeriod; // ms
  uint32_t now = millis(); // ms

  if (now >= scheduledAnnouncementTime) {
    announceMeToChildren();
    scheduledAnnouncementTime = now + announcementPeriod;
  }
}

static inline uint8_t digitFromChar(char c) {
  return c - 48;
}

static inline char charFromDigit(uint8_t digit) {
  return digit + 48;
}

static void flashLed() {
  if (flashLedIsEnabled) {
    digitalWrite(ledPin, HIGH);
    delay(50);
    digitalWrite(ledPin, LOW);
    delay(50);
  }
}

template <typename T>
void sendPairMessageToParent(T &transceiverOnPort, const byte *pairMessage) {
  transceiverOnPort.transceiver.startTransmissionOfBytes(pairMessage,
                                                         pairMessageSize);
}

void enablePinChangeInterrupts() {
  PCICR |= // Pin Change Interrupt Control Register
    bit(PCIE2) | // D0 to D7
    bit(PCIE0); // D8 to D15
}

void setupMultiTransceiver() {
  multiTransceiver.startTimer1();
  multiTransceiver.startTimer2();
  enablePinChangeInterrupts();
  transceiverOnPort1.transceiver.begin();
  transceiverOnPort2.transceiver.begin();
  transceiverOnPort3.transceiver.begin();
  transceiverOnPort4.transceiver.begin();
}

template <typename T>
void transmitAnnouncement(T &transceiverOnPort) {
  transceiverOnPort.transceiver.startTransmissionOfBytes(
    buildAnnouncementMessage({idOfThisNode, transceiverOnPort.portNumber}),
    announcementMessageSize
  );
}

template <typename T>
void announceMeToChild(T &transceiverOnPort) {
  if (transceiverOnPort.portNumber == numberOfPortWithParent) {
    return;
  }
  transmitAnnouncement(transceiverOnPort);
  flashLed();
}

void resetParentExpiryTime() {
  parentExpiryTime = millis() + parentExpiryDuration; // ms
}

template <typename T>
void parseAnnouncementMessage(T &transceiverOnPort, const byte *message) {
  if (thisNodeIsRoot()) {
    return; // root cannot have a parent => ignore announcement
  }

  if (!iHaveAParent()) {
    numberOfPortWithParent = transceiverOnPort.portNumber;
  }

  if (transceiverOnPort.portNumber == numberOfPortWithParent) {
    resetParentExpiryTime(); // call regularly to keep parent fresh
  }

  // Create pair, either describing a parent-child relationship or a loop:
  Port port = decodePort(message[1]);
  Pair pair;
  pair.parentPort = port;
  pair.childPort = {idOfThisNode, transceiverOnPort.portNumber};
  pair.childAngle = angleOfThisNode();
  enqueuePairMessage(buildPairMessage(pair));
}

static inline Pair pairFromPairMessage(const byte *message) {
  Pair pair;
  pair.parentPort = decodePort(message[1]);
  pair.childPort = decodePort(message[2]);
  pair.childAngle = message[3];
  return pair;
}

template <typename T>
bool parseMessage(T &transceiverOnPort, byte *message) {
  if (message == 0) {
    return false;
  }

  if (message[0] & B01000000) {
    // pair message
    enqueuePairMessage(message);
    return true;
  } else {
    // announcement message
    parseAnnouncementMessage(transceiverOnPort, message);
    return true;
  }
  return false;
}

void sendPairMessageToParent(const byte *pairMessage) {
  if (numberOfPortWithParent == transceiverOnPort1.portNumber) {
    sendPairMessageToParent(transceiverOnPort1, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort2.portNumber) {
    sendPairMessageToParent(transceiverOnPort2, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort3.portNumber) {
    sendPairMessageToParent(transceiverOnPort3, pairMessage);
  } else if (numberOfPortWithParent == transceiverOnPort4.portNumber) {
    sendPairMessageToParent(transceiverOnPort4, pairMessage);
  }
}

void announceMeToChildren() {
  announceMeToChild(transceiverOnPort1);
  if (!thisNodeIsRoot()) {
    announceMeToChild(transceiverOnPort2);
    announceMeToChild(transceiverOnPort3);
    announceMeToChild(transceiverOnPort4);
  }
}
