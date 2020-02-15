// These settings shared between nodes and the web app.

#pragma once

#include "namedColors.h"

// How often the entire graph is updated / sent:
const uint32_t graphUpdateInterval = 500; // ms

// How long to wait for a connection to be removed after it has been
// without sign of life:
const uint32_t connectionExpiryDuration =
  2.5 * graphUpdateInterval; // ms

const byte nodeColorsList[][2] =
  {
   {gray, gray},       // ^: {color of top hemisphere, color of bottom hemisph.}
   {red, red},         // A
   {yellow, yellow},   // B
   {lime, lime},       // C
   {aqua, aqua},       // D
   {blue, blue},       // E
   {fuchsia, fuchsia}, // F
   {red, yellow},      // G
   {red, lime},        // H
   {red, aqua},        // I
   {red, blue},        // J
   {red, fuchsia},     // K
   {yellow, lime},     // L
   {yellow, aqua},     // M
   {yellow, blue},     // N
   {yellow, fuchsia},  // O
   {lime, aqua},       // P
   {lime, blue},       // Q
   {lime, fuchsia},    // R
   {aqua, blue},       // S
   {aqua, fuchsia},    // T
   {blue, fuchsia},    // U
   {white, red},       // V
   {white, yellow},    // W
   {white, lime},      // X
   {white, aqua},      // Y
   {white, blue}       // Z
  };

const uint8_t wifiGateway[4] = {192, 168, 4, 1};
