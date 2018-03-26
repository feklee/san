/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var rootNode = require("./root-node");
var program = require("commander");

program.parse(process.argv);

var port = program.args[0];

if (port === undefined) {
    console.error("Missing port");
    process.exit(1);
}

rootNode.connect({
    comName: port,
    onConnected: startWebServer
});
