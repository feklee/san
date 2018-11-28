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
    pairs[action](pair + "0"); // "0" = no angle set
    return true;
}

function addPairCommand(pair) {
    return addOrRemovePair(pair, "Adding", "add");
}

function removePairCommand(pair) {
    return addOrRemovePair(pair, "Removing", "delete");
}

// [0, 180] -> [1, 127] (0 excluded, because that means: no angle)
function encodeAngle(angle) {
    return Math.round(angle * 126 / 180) % 127 + 1;
}

function assignEncodedAngleToPairs(nodeId, encodedAngle) {
    console.log(pairs);
    var pairsToDelete = [];
    var pairsToAdd = [];
    pairs.forEach(function (pair) {
        if (pair.charAt(2) === nodeId) {
            pairsToDelete.push(pair);
            pairsToAdd.push(pair.substr(0, 4) + encodedAngle);
        }
    });
    pairsToDelete.forEach((pair) => pairs.delete(pair));
    pairsToAdd.forEach((pair) => pairs.add(pair));
    console.log(pairs);
}

function angleCommand(parameters) {
    if (!(/^[a-zA-Z\^][0-9]*$/).test(parameters)) {
        complainAboutMalformedCommand();
        return false;
    }
    var nodeId = parameters.charAt(0);
    var angleParameter = parameters.substr(1);
    var encodedAngle;
    if (angleParameter.length > 0) {
        var angle = parseInt(angleParameter);
        console.log(
            `Setting tilt angle of node ${nodeId} to ${angle} degrees`
        );
        encodedAngle = encodeAngle(angle);
    } else {
        console.log(
            `Removing tilt angle from node ${nodeId}`
        );
        encodedAngle = 0;
    }
    assignEncodedAngleToPairs(nodeId, encodedAngle);
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
            if (!addPairCommand(parameters)) {
                return;
            }
            break;
        case "-":
            if (!removePairCommand(parameters)) {
                return;
            }
            break;
        case "/":
            if (!angleCommand(parameters)) {
                return;
            }
            break;
        default:
            complainAboutMalformedCommand();
            return;
        }
    });
});
