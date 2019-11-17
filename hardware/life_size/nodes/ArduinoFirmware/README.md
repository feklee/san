Introduction
============

The Arduino Pro Mini communicates optically with other nodes, and it
communicates via SPI with the ESP-EYE.


Flashing from Linux command line
================================

Example on Linux (replace device name as needed):

    $ arduino --board arduino:avr:pro:cpu=16MHzatmega328 \
      --port /dev/ttyUSB0 --upload ArduinoFirmware.ino
