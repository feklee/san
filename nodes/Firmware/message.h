#ifndef message_h
#define message_h

#include "Arduino.h"
#include "Pair.h"

enum class MessageType : uint8_t {announcement = B00000000,
                                  pair = B01000000};

const uint8_t announcementMessageSize = 2;
const uint8_t pairMessageSize = 3;

// There likely are better ways to calculate a six bit checksum.
template <uint8_t payloadSize>
inline uint8_t sixBitChecksumFromPayload(const byte *payload) {
  uint8_t sum = 0;
  for (uint8_t i = 0; i < payloadSize; i ++) {
    sum += payload[i] & B00001111;
    sum += (payload[i] & B11110000) >> 4;
  }
  return sum & B00111111;
}

inline uint8_t sixBitChecksumStoredInStartByte(byte b) {
  return b & B00111111;
}

template <uint8_t messageSize>
inline bool checksumIsCorrect(const byte *message) {
  const byte * const payload = message + 1;
  const uint8_t payloadSize = messageSize - 1;
  return
    sixBitChecksumFromPayload<payloadSize>(payload) ==
    sixBitChecksumStoredInStartByte(*message);
}

// Encoding:
//
//     1TCCCCCC
//
// With:
//
//   * `1`: denotes start of message
//
//   * `T`: denotes type (announcement or pair)
//
//   * `CCCCCC`: six bit checksum of payload
template <uint8_t payloadSize>
inline byte buildStartByte(const MessageType type,
                                byte * const payload) {
  return
    B10000000 |
    uint8_t(type) |
    sixBitChecksumFromPayload<payloadSize>(payload);
}

template <uint8_t messageSize>
inline void buildMessage(byte * const message,
                         const MessageType type) {
  byte * const payload = message + 1;
  const uint8_t payloadSize = messageSize - 1;
  message[0] = buildStartByte<payloadSize>(type, payload);
}

inline byte *buildAnnouncementMessage(Port port) {
  static byte message[announcementMessageSize];
  message[1] = encodePort(port);
  buildMessage<announcementMessageSize>(message, MessageType::announcement);
  return message;
}

inline byte *buildPairMessage(Pair pair) {
  static byte message[pairMessageSize + 1 /* TODO */];
  message[1] = encodePort(pair.parentPort);
  message[2] = encodePort(pair.childPort);
  buildMessage<pairMessageSize>(message, MessageType::pair);
  message[3] = '\0'; // TODO
  return message;
}

inline bool byteStartsMessage(const byte b) {
  return b & B10000000;
}

inline bool byteStartsAnnouncement(const byte b) {
  return (b & B01000000) == uint8_t(MessageType::announcement);
}

#endif
