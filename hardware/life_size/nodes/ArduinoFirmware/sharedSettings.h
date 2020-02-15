// These settings shared between nodes (Arduino/C++, ESP32/C) and the web app.

// Fragile, be careful with reformatting!

#pragma once

#include "namedColors.h"

// How often the entire graph is updated / sent:
#define graphUpdateInterval 500 // ms

// How long to wait for a connection to be removed after it has been
// without sign of life:
#define connectionExpiryDuration 2.5 * graphUpdateInterval // ms

const uint8_t nodeColorsList[][2] =
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

// Wi-Fi gateway
const uint8_t gw[4] =
  {192, 168, 4, 1}; // needs to be on separate line, or the current Rollup
                    // regexp rules don't work
