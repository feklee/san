// These settings shared between nodes and the web app.

#pragma once

#include "colors.h"

// How often the entire graph is updated / sent:
const uint32_t graphUpdateInterval = 500; // ms

// How long to wait for a connection to be removed after it has been
// without sign of life:
const uint32_t connectionExpiryDuration =
  2.5 * graphUpdateInterval; // ms

const byte * const nodeColorsList[][2] =
  {
   {gray, gray}, // ^: {color of top hemisphere, color of bottom hemisphere}
   {red, red}, // A
   {yellow, yellow}, // B
   {lime, lime}, // ...
   {aqua, aqua},
   {blue, blue},
   {fuchsia, fuchsia},
   {red, yellow},
   {red, lime},
   {red, aqua},
   {red, blue},
   {red, fuchsia},
   {yellow, lime},
   {yellow, aqua},
   {yellow, blue},
   {yellow, fuchsia},
   {lime, aqua},
   {lime, blue},
   {lime, fuchsia},
   {aqua, blue},
   {aqua, fuchsia},
   {blue, fuchsia},
   {white, red}
  };
