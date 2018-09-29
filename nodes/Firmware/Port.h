#ifndef Port_h
#define Port_h

#include "Arduino.h"

struct Port {
  char nodeId;
  uint8_t portNumber;
};

inline Port portFromPayload(char payload) {
  uint8_t encodedNodeId = (payload >> 2) & B11111;
  uint8_t encodedPortNumber = payload & B11;
  char nodeId = encodedNodeId == 1 ? '*' : (encodedNodeId + 0x3F);
  uint8_t portNumber = encodedPortNumber + 1;
  return {nodeId, portNumber};
}

#endif
