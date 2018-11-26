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

console.log("Add pair, by example: +*1A3");
console.log("Remove pair, by example: -A2B1");
startWebServer(function () {
    cli.enableInput(function (command) {
        if (!(/^[+\-]([a-zA-Z*][1-4][a-zA-Z][1-4])$/).test(command)) {
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
