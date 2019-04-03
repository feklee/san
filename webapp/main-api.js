/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var set = new Set();
var sharedSettings = require("./shared-settings");
const url = require("url");
var nodeStatic = require("node-static");
var fileServer = new nodeStatic.Server("./frontend/public", {cache: 0});

function broadcastSet() {
    set.forEach(function (data) {
        var message = {type: "data", text: data};
        webSocket.broadcast(message);
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

setInterval(broadcastSet, sharedSettings.graphUpdateInterval);

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

var http = require("http");
var nodeStatic = require("node-static");
var webSocket = require("./web-socket");
var cli = require("./cli");
var apiPort = 8081;

var callFitnessApi = function (args) {
    var s = decodeURIComponent(args[0]);
    var i;
    var pair;
    while (true) {
        if (s.indexOf("+") < 0) {
            break;
        }
        if (s.charAt(0) === "+") {
            pair = s.substring(1, 5);
            addPairCommand(pair);
            s = s.substring(5);
        } else {
            return {
                error: "invalid sequence"
            };
        }
    }

    return {
        pair: pair,
        fitness: 3
    };
};

var callApi = function (functionName, args) {
    switch (functionName) {
    case "get-fitness":
        return callFitnessApi(args);
    default:
        return {
            error: "unknown API function `" + functionName + "`"
        };
    }
};

var httpServer = http.createServer(function (request, response) {
    if (request.method === "GET") {
        var pathname = url.parse(request.url, true).pathname;
        var pathElements = pathname.split("/");
        var result;
        if (pathElements.length < 2 || pathname === "/") {
            result = {
                error: "bad request"
            };
        } else {
            result = callApi(pathElements[1], pathElements.slice(2));
        }
        response.writeHead(200, {
            "Content-Type": "application/json"
        });
        response.write(JSON.stringify(result));
        response.end();
    }
}).listen(apiPort);

startWebServer(function () {});

webSocket.create(httpServer);
