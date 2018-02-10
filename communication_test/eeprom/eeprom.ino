#include <SoftSerial.h>
#include <EEPROM.h> // Library may need to be copied:
                    // https://digistump.com/board/index.php?topic=1132.0

SoftSerial softSerial(4, 4);

void setup(){
  softSerial.begin(4800);
  softSerial.listen();
  softSerial.txMode();
//  EEPROM.write(0, 'a');
}

void loop() {
  char c = EEPROM.read(0);
  char buffer[] = {'E', 'E', 'P', 'R', 'O', 'M', ':', ' ', c, '\n', '\0'};
  softSerial.write(buffer);
  delay(500);
}
