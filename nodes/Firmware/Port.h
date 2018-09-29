#ifndef Port_h
#define Port_h

#include "Arduino.h"

struct Port {
  char nodeId;
  uint8_t portNumber;
};

inline Port decodePort(char data) {
  uint8_t encodedNodeId = (data >> 2) & B11111;
  uint8_t encodedPortNumber = data & B11;
  char nodeId = encodedNodeId == 1 ? '*' : (encodedNodeId + 0x3F);
  uint8_t portNumber = encodedPortNumber + 1;
  return {nodeId, portNumber};
}

// Encoding:
//
//     0IIIII##
//
// With:
//
//   * `0`: denotes payload
//
//   * `IIIII`: 5-bit node ID (*A-Z...)
//
//   * `##`: 2-bit port number (1-4)
inline char encodePort(Port port) {
  uint8_t encodedNodeId = port.nodeId == '*' ?
    1 : // != 0, because otherwise encoding for *1 would be '\0'
    port.nodeId - 0x3f; // A -> B00010, B -> B00011, ...
  uint8_t encodedPortNumber =
    port.portNumber - 1; // 1 -> B00, 2 -> B01, ...
  return encodedNodeId << 2 | encodedPortNumber;
}

#endif
