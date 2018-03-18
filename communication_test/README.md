Instructions
============

 1. Write ID on EEPROM of each MCU.

 2. Build and upload Arduino sketch `node` to MCU.

 3. List available serial ports for communication with the Teensy:

        $ cd app/
        $ npm start

 4. Start server, here with serial port `COM6`:

        $ npm start COM6

 5. Open index page in browser, in full screen mode on a 16:9 screen. Example
    URL (adapt to your system):

        http://localhost:8080


Build instructions
==================

First enter the directory `app/public`, then:

 1. Install Bower packages:

        $ bower install

 2. Compile CSS:

        $ sass -E utf-8 --update sass:stylesheets

    During development, you may use:

        $ sass -E utf-8 --watch sass:stylesheets


Coding conventions
==================

  * Maximum line length: 80 characters

  * Comments in Markdown

  * JavaScript passes JSLint.
