/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var set = new Set();
var sharedSettings = require("./shared-settings");

function sendSet() {
    set.forEach(function (data) {
        var message = {type: "data", text: data};
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
    set[action](pair + "0"); // "0" = no angle set
    return true;
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
            pairsToAdd.push(data.substr(0, 4) +
                            encodedAngle.toString(16));
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

var http = require("http");
const url = require("url");
var badRequest = {
    error: "bad request"
};

var callGetFitness = function (params) {
    if (params.length < 2) {
        return badRequest;
    }

    var sequence = params[0];
    var command;
    var pair;
    var result = [];
    while (true) {
        if (sequence.indexOf("+") < 0) {
            break;
        }
        command = sequence.charAt(0);
        if (command !== "+") {
            return badRequest;
        }
        pair = sequence.substr(1, 4);
        result.push(pair);
        sequence = sequence.substr(5);
        addPairCommand(pair);
    }
    return result;
};

var httpServer = http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var pathElements = pathName.split("/");
    var result;

    pathElements.shift();
    pathElements = pathElements.map(function (el) {
        return decodeURIComponent(el);
    });

    if (pathElements.length === 0) {
        result = badRequest;
    } else {
        var functionName = pathElements[0];
        switch (functionName) {
        case "get-fitness":
            result = callGetFitness(pathElements.splice(1));
            break;
        default:
            result = badRequest;
        }
    }

    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
}).listen(8081);

webSocket.create(httpServer);
