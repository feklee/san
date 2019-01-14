Building
========

 1. Install packages:

        $ yarn install

 2. Run tests:

        $ yarn test

 3. Build frontend:

        $ ./node_modules/.bin/rollup --config

      * On Windows call `rollup.cmd` instead of `rollup`.

      * Append `--watch` for automatic rebuilds during development.


Running the webapp
==================

 1. Get help:

        $ yarn start

 2. Run the app, applying options as described in help.

 3. Connect to the web server with a browser.


How to use the fitness API
==========================

 1. Make sure that the webapp is built. (see above)

 2. Start the backend:

        $ yarn start api

 3. Open the frontend in the browser: (tested with Chrome)

    http://localhost:8080

 4. Query the API, for example:

    http://localhost:8081/fitness/+^1D3(-.5,.1,.2),+D2B2(.5,.7,-.3)

    This connects `D3` to root, then `B2` to `D2`.

    The same network with maximum fitness 0:

    http://localhost:8081/fitness/+^1D3(-.5,0,0),+D2B2(.5,0,0)


Coding conventions
==================

  * Maximum line length: 80 characters

  * Comments in Markdown

  * JavaScript passes JSLint.


Reading
=======

[SAN: Location Optimizer][1]

[1]: https://feklee.github.io/san/notes/145c7131-6c7f-49cb-8ecc-07658b5c4a96/
