#pragma once

// ID needs to be defined prior to including this header file

#define STRINGIFY(x) #x
#define TOSTRING(x) STRINGIFY(x)

constexpr char idOfThisNode = TOSTRING(ID)[0];

static inline bool thisNodeIsRoot() {
  return idOfThisNode == '^';
}
