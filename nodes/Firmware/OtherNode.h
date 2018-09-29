#ifndef OtherNode_h
#define OtherNode_h

#include "Arduino.h"

struct OtherNode {
  char nodeId;
  uint8_t portNumber; // port that other node connects with
};

inline OtherNode otherNodeFromPayload(char payload) {
  OtherNode otherNode;
  uint8_t encodedNodeId = (payload >> 2) & B11111;
  uint8_t encodedPortNumber = payload & B11;
  otherNode.nodeId = encodedNodeId == 1 ? '*' : (encodedNodeId + 0x3F);
  otherNode.portNumber = encodedPortNumber + 1;
  return otherNode;
}

#endif
