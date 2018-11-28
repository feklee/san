#pragma once

#include <MultiTrans.h>
#include "Arduino.h"
#include "Port.h"
#include "message.h"

static const uint8_t maxNumberOfBytesPerTransmission = 3;
static const bool recordDebugData = false;
static const uint8_t customReceiveBufferSize = 0xff;
using MT = MultiTrans<bitDurationExp,
                      maxNumberOfBytesPerTransmission,
                      recordDebugData,
                      customReceiveBufferSize>;
MT multiTransceiver;

template <uint8_t t, uint8_t u>
class TransceiverOnPort {
  static const uint8_t pinNumber = t;
  
public:
  MT::Transceiver<pinNumber> transceiver;
  static const uint8_t portNumber = u;

  byte *getMessage();
};

template <uint8_t t, uint8_t u>
byte *TransceiverOnPort<t, u>::getMessage() {
  static uint8_t messageSize = 0;
  static uint8_t messagePos = 0;
  static byte message[maxNumberOfBytesPerTransmission];
  static bool gettingMessage = false;
  static MessageType messageType;

  while (true) {
    bool byteWasFound;
    byte b = transceiver.getNextByte(byteWasFound);

    if (!byteWasFound) {
      return 0;
    }

    if (byteStartsMessage(b)) {
      if (byteStartsAnnouncement(b)) {
        messageType = MessageType::announcement;
        messageSize = announcementMessageSize;
      } else {
        messageType = MessageType::pair;
        messageSize = pairMessageSize;
      }
      messagePos = 0;
      gettingMessage = true;
    }

    if (gettingMessage) {
      if (messagePos < messageSize) {
        message[messagePos] = b;
        messagePos ++;
      }
      if (messagePos == messageSize) {
        gettingMessage = false;
        switch (messageType) {
        case MessageType::announcement:
          if (checksumIsCorrect<announcementMessageSize>(message)) {
            return message;
          }
        case MessageType::pair:
          if (checksumIsCorrect<pairMessageSize>(message)) {
            return message;
          }
        }
      }
    }
  }
}
