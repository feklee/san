/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var pairs = new Set();
var sharedSettings = require("./shared-settings");

function sendSet() {
    pairs.forEach(function (pair) {
        var message = {type: "data", text: pair};
        webSocket.send(message);
    });
}

setInterval(sendSet, sharedSettings.graphUpdateInterval);

console.log("Add pair, by example:");
console.log();
console.log("    +^1A3");
console.log();
console.log("Here:");
console.log();
console.log("  * `^1` is port 1 on node `^` (root node).");
console.log();
console.log("  * `A3` is port 3 on node `A`.");
console.log();
console.log("Remove pair, by example:");
console.log();
console.log("    -A2B1");
console.log();
console.log("Set tilt angle, by example (D tilted by 125 degrees):");
console.log();
console.log("    /D125");
startWebServer(function () {
    cli.enableInput(function (command) {
        if (!(/^[+\-]([a-zA-Z\^][1-4][a-zA-Z][1-4])$/).test(command)) {
            console.error("Malformed command");
            return;
        }
        var pair = command.substr(1);
        switch (command.charAt(0)) {
        case "+":
            console.log("Adding ", pair);
            pairs.add(pair);
            break;
        case "-":
            pairs.delete(pair);
            break;
        }
    });
});
