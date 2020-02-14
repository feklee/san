Introduction
============

The ESP-EYE sends information about neighbors of the current node to the
network’s brain.


Development with USB connection
===============================

  * Flashing:
  
      - Make sure that the correct camera pinout is selected:
  
            $ make menuconfig

      - Build and upload: (high baud rate)

            $ python2 $(which idf.py) -p /dev/ttyUSB0 flash --baud 2000000
            
      - Re-plug the USB connection, or else monitoring won’t work.

  * Monitoring:
  
      - If the Arduino is connected, keep the reset button pressed.

        *Background:* Unless floating, the CLK pin needs to be pulled high, or
        else the ESP-EYE won’t boot.
      
      - Start the monitor:

            $ python2 $(which idf.py) -p /dev/ttyUSB0 monitor
            
      - Wait until the ESP-EYE has booted.
      
      - Release the Arduino’s reset button.

  * Troubleshooting if the video stream doesn’t load: Check with the example
    camera web server included with ESP-WHO. Maybe the camera is not properly
    connected.
