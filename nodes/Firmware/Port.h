#ifndef Port_h
#define Port_h

#include "Arduino.h"

struct Port {
  char nodeId;
  uint8_t portNumber;
};

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
inline byte encodePort(Port port) {
  uint8_t encodedNodeId = port.nodeId == '*' ?
    0 :
    port.nodeId - 0x40; // A -> B00001, B -> B00010, ...
  uint8_t encodedPortNumber =
    port.portNumber - 1; // 1 -> B00, 2 -> B01, ...
  return encodedNodeId << 2 | encodedPortNumber;
}

inline Port decodePort(byte data) {
  uint8_t encodedNodeId = (data >> 2) & B11111;
  uint8_t encodedPortNumber = data & B11;
  char nodeId = encodedNodeId == 0 ? '*' : (encodedNodeId + 0x40);
  uint8_t portNumber = encodedPortNumber + 1;
  return {nodeId, portNumber};
}

#endif
