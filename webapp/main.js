/*jslint node: true, maxlen: 80 */

"use strict";

var program = require("commander");

program
    .command("list", "List serial ports")
    .command("connect <port>", "Connect to root node on serial port")
    .command("wifi", "Connect to SAN network via WiFi")
    .command("simulate", "Simulate connection")
    .command("rebroadcast", "Expects previous log output on stdin")
    .parse(process.argv);
