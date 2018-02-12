#include "OtherNode.h"

OtherNode::OtherNode(char nodeId, uint8_t portNumber) :
  nodeId(nodeId), portNumber(portNumber) {}

boolean OtherNode::operator==(const OtherNode &rhs) {
  return (this->nodeId == rhs.nodeId &&
          this->portNumber == rhs.portNumber);
}

boolean OtherNode::operator!=(const OtherNode &rhs) {
  return !(*this == rhs);
}
 
boolean OtherNode::isEmpty() {
  return *this == emptyOtherNode;
}
