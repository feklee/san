Flashing from Linux command line
================================

Example on Linux (replace device name and node ID as needed):

    $ ./upload.sh /dev/ttyUSB0 A

To view serial output (to quite, press <kbd>Ctrl</kbd>-<kbd>a</kbd> followed by
<kbd>k</kbd>):

    $ screen /dev/ttyUSB0 115200
