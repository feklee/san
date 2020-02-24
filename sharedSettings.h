// These settings shared between nodes (Arduino/C++, ESP32/C) and the web app.

// Fragile, be careful with reformatting!

#pragma once

#define black 0b000000
#define gray 0b101010
#define white 0b111111
#define red 0b110000
#define yellow 0b111100
#define lime 0b001100
#define aqua 0b001111
#define blue 0b000011
#define fuchsia 0b110011

// How often the entire graph is updated / sent:
#define graphUpdateInterval 500 // ms

// How long to wait for a connection to be removed after it has been
// without sign of life:
#define connectionExpiryDuration 2.5 * graphUpdateInterval // ms

// Wi-Fi gateway
const uint8_t gw[] =
  {192, 168, 4, 1}; // needs to be on separate line, or the current Rollup
                    // regexp rules don't work

// Values: {color of top hemisphere, color of bottom hemisphere}
const uint8_t nodeColorsList[][2] =
  {
   {gray, gray},       // ^
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
