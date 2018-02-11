#include "OtherNode.h"

boolean OtherNode::operator==(const OtherNode &rhs) {
  return (this->nodeId == rhs.nodeId &&
          this->portNumber == rhs.portNumber);
}

boolean OtherNode::operator!=(const OtherNode &rhs) {
  return !(*this == rhs);
}
