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
inline uint8_t sixBitChecksumFromPayload(const char *payload) {
  uint8_t sum = 0;
  for (uint8_t i = 0; i < payloadSize; i ++) {
    sum += payload[i] & B00001111;
    sum += (payload[i] & B11110000) >> 4;
  }
  return sum & B00111111;
}

inline uint8_t sixBitChecksumFromStartCharacter(char character) {
  return character & B00111111;
}

template <uint8_t messageSize>
inline bool checksumIsCorrect(const char *message) {
  const char * const payload = message + 1;
  const char payloadSize = messageSize - 1;
  return
    sixBitChecksumFromPayload<payloadSize>(payload) ==
    sixBitChecksumFromStartCharacter(*message);
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
inline char buildStartCharacter(const MessageType type,
                                char * const payload) {
  return
    B10000000 |
    uint8_t(type) |
    sixBitChecksumFromPayload<payloadSize>(payload);
}

template <uint8_t messageSize>
inline void buildMessage(char * const message, const MessageType type) {
  char * const payload = message + 1;
  const char payloadSize = messageSize - 1;
  message[0] = buildStartCharacter<payloadSize>(type, payload);
  message[messageSize] = '\0';
}

inline char *buildAnnouncementMessage(Port port) {
  static char message[announcementMessageSize + 1];
  message[1] = encodePort(port);
  buildMessage<announcementMessageSize>(message, MessageType::announcement);
  return message;
}

inline char *buildPairMessage(Pair pair) {
  static char message[pairMessageSize + 1];
  message[1] = encodePort(pair.parentPort);
  message[2] = encodePort(pair.childPort);
  buildMessage<pairMessageSize>(message, MessageType::pair);
  return message;
}

inline bool characterStartsMessage(const char character) {
  return character & B10000000;
}

inline bool characterStartsAnnouncement(const char character) {
  return (character & B01000000) == uint8_t(MessageType::announcement);
}

#endif
