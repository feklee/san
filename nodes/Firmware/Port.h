#ifndef Port_h
#define Port_h

#include "Arduino.h"

struct Port {
  char nodeId;
  uint8_t portNumber;
};

inline Port portFromPayload(char payload) {
  Port port;
  uint8_t encodedNodeId = (payload >> 2) & B11111;
  uint8_t encodedPortNumber = payload & B11;
  port.nodeId = encodedNodeId == 1 ? '*' : (encodedNodeId + 0x3F);
  port.portNumber = encodedPortNumber + 1;
  return port;
}

#endif
