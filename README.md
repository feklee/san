[![Build Status](https://travis-ci.org/feklee/san.svg?branch=master)](https://travis-ci.org/feklee/san)

Introduction
============

Self aware network structure. It understands its own topology.


Construction
============

Nodes
-----

Nodes are 3D printed, composed of two hemispheres that are screwed.

Parametric design (Fusion 360): http://a360.co/2FMH0TC

Inside of each node there is a tiny microcontroller, an Arduino Pro Mini. The
root node also contains a USB interface.


Edges
-----

Edges are composed of RG58 cables inside metal tubes, connected to BNC
connectors.


Software
========

Setup
-----

 1. Write ID on EEPROM of each MCU: `idWriter`

    The root node needs to be named: `*`

 2. Build and upload Arduino sketch to MCU: `node`

 3. List available serial ports for communication with the Teensy:

        $ cd webapp/
        $ npm start list

 4. Start server, here with serial port `COM6`:

        $ npm start connect COM6

 5. Open index page in browser, in full screen mode on a 16:9 screen. Example
    URL (adapt to your system):

        http://localhost:8080


Build instructions
------------------

First enter the directory `app/public`, then:

 1. Install Bower packages:

        $ bower install

 2. Compile CSS:

        $ sass -E utf-8 --update sass:public/stylesheets

    During development, you may use:

        $ sass -E utf-8 --watch sass:public/stylesheets

Also run (optinially with the option `--watch` during development):

    cd webapp
    rollup --config


Coding conventions
------------------

  * Maximum line length: 80 characters

  * Comments in Markdown

  * JavaScript passes JSLint.


License
=======

Except where noted otherwise, files are licensed under the WTFPL.

Copyright © 2018 [Felix E. Klee](felix.klee@inka.de)

This work is free. You can redistribute it and/or modify it under the terms of
the Do What The Fuck You Want To Public License, Version 2, as published by Sam
Hocevar. See the COPYING file for more details.
