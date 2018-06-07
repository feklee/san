[![Build Status](https://travis-ci.org/feklee/san.svg?branch=master)](https://travis-ci.org/feklee/san)

Introduction
============

Self aware network structure. It understands its own topology. Get started by
building the construction and running the software.

![Construction](images/construction.jpg)

![Visualization](images/visualization.png)


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

Setup of nodes
--------------

 1. Write ID on EEPROM of each MCU: `idWriter`

    The root node needs to be named: `*`

 2. Build and upload Arduino sketch to MCU: `node`


Building the webapp
-------------------

First enter the directory `webapp`, then:

 1. Install packages:

        $ yarn install

 2. Run tests:

        $ yarn test

 3. Build frontend:

        $ ./node_modules/.bin/rollup --config

      * On Windows call `rollup.cmd` instead of `rollup`.

      * Append `--watch` for automatic rebuilds during development.


Running the webapp
------------------

 1. Get help:

        $ yarn start

 2. Run the app, applying options as described in help.

 3. Connect to the web server with a browser.


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
