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

function complainAboutMalformedCommand() {
    console.error("Malformed command");
}

function pairIsValid(pair) {
    return /^[a-zA-Z\^][1-4][a-zA-Z][1-4]$/.test(pair);
}

function addOrRemovePair(pair, description, action) {
    if (!pairIsValid(pair)) {
        complainAboutMalformedCommand();
        return false;
    }
    console.log(description, pair);
    pairs[action](pair);
    return true;
}

function addPair(pair) {
    return addOrRemovePair(pair, "Adding", "add");
}

function removePair(pair) {
    return addOrRemovePair(pair, "Removing", "delete");
}

function setOrUnsetAngle(parameters) {
    if (!(/^[a-zA-Z\^][0-9]*$/).test(parameters)) {
        complainAboutMalformedCommand();
        return false;
    }
    var nodeId = parameters.charAt(0);
    var angleParameter = parameters.substr(1);
    if (angleParameter.length > 0) {
        var angle = parseInt(angleParameter);
        console.log(
            `Setting tilt angle of node ${nodeId} to ${angle} degrees`
        );
    } else {
        console.log(
            `Removing tilt angle from node ${nodeId}`
        );
    }
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
console.log("Set tilt angle, by example (C tilted by 125 degrees):");
console.log();
console.log("    /C125");
console.log();
console.log("Unset tilt angle, by example:");
console.log();
console.log("    /C");
console.log();

startWebServer(function () {
    cli.enableInput(function (command) {
        var parameters = command.substr(1);
        switch (command.charAt(0)) {
        case "+":
            if (!addPair(parameters)) {
                return;
            }
            break;
        case "-":
            if (!removePair(parameters)) {
                return;
            }
            break;
        case "/":
            if (!setOrUnsetAngle(parameters)) {
                return;
            }
            break;
        default:
            complainAboutMalformedCommand();
            return;
        }
    });
});
