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

function sendPairToFrontend(pair) {
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

startWebServer();

var http = require("http");
const url = require("url");

var resultDescribesAnError = function (result) {
    return result.error !== undefined;
};

var parseSequence = function (sequence) {
    var s = sequence;
    var command;
    var pair;
    var result = [];
    while (s !== "") {
        command = s.charAt(0);
        if (command !== "+") {
            return {error: "bad sequence `" + sequence + "`"};
        }
        pair = s.substr(1, 4);
        result.push(pair);
        s = s.substr(5);
        sendPairToFrontend(pair);
    }
    return result;
};

var parseEncodedLocations = function (encodedLocations) {
    var s = encodedLocations;
    var result = {};
    var regex =
            /^([A-Z])(-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*)/;
    var match;
    var nodeId;
    var x;
    var y;
    var z;
    var encodedLocation;
    while (s !== "") {
        match = s.match(regex);
        if (match === null) {
            return {error: "bad location `" + encodedLocation + "`"};
        }
        encodedLocation = match[0];
        nodeId = match[1];
        x = parseFloat(match[2]);
        y = parseFloat(match[3]);
        z = parseFloat(match[4]);
        if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
            return {error: "bad location `" + encodedLocation + "`"};
        }
        result[nodeId] = [x, y, z];
        s = s.substr(encodedLocation.length);
    }
    return result;
};

var getFitness = function (params) {
    if (params.length < 2) {
        return {error: "incomplete fitness parameters"};
    }

    var result1 = parseSequence(params[0]);
    if (resultDescribesAnError(result1)) {
        return result1;
    }

    var result2 = parseEncodedLocations(params[1]);
    if (resultDescribesAnError(result2)) {
        return result2;
    }
    return {
        sequence: result1,
        locations: result2
    };
};

var apiPort = 8081;
var httpServer = http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var pathElements = pathName.split("/");
    var result;

    pathElements.shift();
    pathElements = pathElements.map(function (el) {
        return decodeURIComponent(el);
    });

    if (pathElements.length === 0) {
        result = {error: "missing parameters"};
    } else {
        var functionName = pathElements[0];
        switch (functionName) {
        case "fitness":
            result = getFitness(pathElements.splice(1));
            break;
        default:
            result = {error: "unknown API function `" + functionName + "`"};
        }
    }

    if (resultDescribesAnError(result)) {
        result.example = "/fitness/+^1D3+D2B2/B1.5,1.2,-3.4D-.5,1,4.";
    }

    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
}).listen(apiPort, function () {
    cli.log("API is listening on port " + apiPort + " (HTTP)");
});

webSocket.create(httpServer);
