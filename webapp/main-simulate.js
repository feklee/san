/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var set = new Set();
var sharedSettings = require("./shared-settings");
var pairIsValid = require("./pair-is-valid");
var program = require("commander");

program.parse(process.argv);
var connectionType = program.args[0];
if (connectionType === undefined) {
    connectionType = "simulation";
}

function sendSet() {
    set.forEach(function (data) {
        var message = {type: "data", text: data};
        webSocket.broadcast(message);
    });
}

function complainAboutMalformedCommand() {
    console.error("Malformed command");
}

function addPairCommand(pair) {
    if (!pairIsValid(pair)) {
        complainAboutMalformedCommand();
        return false;
    }
    console.log("Adding", pair);
    set.add(pair + "0"); // "0" = no angle set
    return true;
}

function removePairCommand(pair) {
    if (!pairIsValid(pair)) {
        complainAboutMalformedCommand();
        return false;
    }
    console.log("Removing", pair);
    set.forEach(function (data) {
        if (data.substr(0, 4) === pair) {
            set.delete(data);
        }
    });
    return true;
}

// [0, 180] -> [1, 127] (0 excluded, because that means: no angle)
function encodeAngle(angle) {
    return Math.round(angle * 126 / 180) % 127 + 1;
}

function assignEncodedAngleToPairs(nodeId, encodedAngle) {
    var pairsToDelete = [];
    var pairsToAdd = [];
    set.forEach(function (data) {
        if (data.charAt(2) === nodeId) {
            pairsToDelete.push(data);
            pairsToAdd.push(data.substr(0, 4) + encodedAngle.toString(16));
        }
    });
    pairsToDelete.forEach((pair) => set.delete(pair));
    pairsToAdd.forEach((pair) => set.add(pair));
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

console.log("Add connection:");
console.log();
console.log("    +^1A3");
console.log();
console.log("Here:");
console.log();
console.log("  * `^1` is port 1 on node `^` (root node).");
console.log();
console.log("  * `A3` is port 3 on node `A`.");
console.log();
console.log("Remove connection A2, B1:");
console.log();
console.log("    -A2B1");
console.log();
console.log("Set tilt angle of node C to 125 degrees:");
console.log();
console.log("    /C125");
console.log();
console.log("Unset tilt angle of node C:");
console.log();
console.log("    /C");
console.log();

startWebServer({
    onListening: function () {
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
    },
    connectionTypeToInject: connectionType
});
