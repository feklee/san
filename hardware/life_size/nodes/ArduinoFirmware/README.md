Introduction
============

The Arduino Pro Mini communicates optically with other nodes, and it
communicates via SPI with the ESP-EYE.


Flashing from Linux command line
================================

Example on Linux (replace device name, MHz speed, and node ID as needed):

    $ ./upload.sh /dev/ttyUSB0 8 A

To view serial output (to quite, press <kbd>Ctrl</kbd>-<kbd>a</kbd> followed by
<kbd>k</kbd>):

    $ screen /dev/ttyUSB0 115200
