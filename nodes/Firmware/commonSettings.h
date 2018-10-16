// Common settings, shared between nodes and the web app

// How often the entire graph is updated / sent:
const uint32_t graphUpdateInterval = 500; // ms

// How long to wait for a connection to be removed after it has been
// without sign of life:
const uint32_t connectionExpiryDuration =
  2.5 * graphUpdateInterval; // ms
