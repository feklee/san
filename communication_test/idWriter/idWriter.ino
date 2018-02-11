// Writes an ID into an microcontroller. Change the ID for each individual
// microcontroller!

#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0

char id = 'b';

void setup() {
  EEPROM.write(0, id);
}

void loop() {}
