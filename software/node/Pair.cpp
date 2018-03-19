#include "Pair.h"

Pair::Pair(OtherNode firstNode, OtherNode secondNode) :
  firstNode(firstNode), secondNode(secondNode) {}

boolean Pair::isEmpty() {
  return firstNode.isEmpty() && secondNode.isEmpty();
}
