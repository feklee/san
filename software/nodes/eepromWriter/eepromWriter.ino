// Writes an ID into an microcontroller. Change the ID for each individual
// microcontroller!

#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0
#include "id.h" // contains e.g. `char id = 'E';`
#include "colors.h"

void setNodeColor(char nodeId, const byte *color1, const byte *color2) {
  if (nodeId == id) {
    EEPROM.write(1, color1[0]);
    EEPROM.write(2, color1[1]);
    EEPROM.write(3, color1[2]);
    EEPROM.write(4, color2[0]);
    EEPROM.write(5, color2[1]);
    EEPROM.write(6, color2[2]);
  }
}

void setup() {
  EEPROM.write(0, id);
#include "node_colors.h"
}

void loop() {}
