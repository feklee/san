/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var rootNode = require("./root-node");
var program = require("commander");
var cli = require("./cli");

program.parse(process.argv);

var port = program.args[0];

if (port === undefined) {
    cli.logError("Missing port");
    process.exit(1);
}

rootNode.connect({
    comName: port,
    onConnected: startWebServer
});
