/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var rootNode = require("./root-node");
var program = require("commander");
var cli = require("./cli");
var physicalConnection = require("./physical-connection");

program.parse(process.argv);

var port = program.args[0];

if (port === undefined) {
    cli.log("Missing port");
    process.exit(1);
}

physicalConnection.type = "serial";

rootNode.connect({
    comName: port,
    onConnected: startWebServer
});
