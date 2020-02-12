Introduction
============

The ESP-EYE sends information about neighbors of the current node to the
network’s brain.


Development with USB connection
===============================

  * Fast flashing of ESP-EYE (builds as well):

        $ python2 $(which idf.py) -p /dev/ttyUSB0 flash --baud 2000000
        
    After flashing, re-plug the USB connection, or else monitoring won’t work.

  * Monitoring:

        $ python2 $(which idf.py) -p /dev/ttyUSB0 monitor

    *Troubleshooting* if the monitor output does not advance (no log output):
    Unless floating, the CLK pin needs to be pulled high, or else the ESP-EYE
    won’t boot. This is done when the connected Arduino starts. So, if the
    ESP-EYE doesn’t boot, reset the Arduino, then immediately try again.
