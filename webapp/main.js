/*jslint node: true, maxlen: 80 */

"use strict";

var program = require("commander");

program
    .command("list", "List serial ports")
    .command("connect <port>", "Connect to root node on serial port")
    .command("wifi", "Connect to SAN network via WiFi")
    .command(
        "simulate",
        "Simulate connection (to hide log, redirect stderr to null device)"
    )
    .command(
        "rebroadcast",
        "Read previous log from stdin and replay that session"
    )
    .parse(process.argv);
