/*jslint node: true, maxlen: 80 */

"use strict";

var program = require("commander");

program
    .command("list", "List serial ports")
    .command("connect <port>", "Connect to root node")
    .command("simulate", "Simulate connection")
    .command("api", "Provide API")
    .parse(process.argv);
