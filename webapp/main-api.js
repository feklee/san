/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var sharedSettings = require("./shared-settings");

function sendPair(pair) {
    var message = {type: "data", text: pair};
    webSocket.send(message);
};

function requestFitness() {
    webSocket.send({
        type: "fitness",
        text: "fitness requested"
    });
}

function addPairWithLocation(pair) {
    console.log("Adding", pair);
    sendPair(pair);
    return true;
}

startWebServer();

var http = require("http");
const url = require("url");

var resultDescribesAnError = function (result) {
    return result.error !== undefined;
};

var parseEncodedLocation = function (encodedLocation) {
    var x = parseFloat(encodedLocation[0]);
    var y = parseFloat(encodedLocation[1]);
    var z = parseFloat(encodedLocation[2]);
    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
        return null;
    }
    return [x, y, z];
};

var parseSequence = function (sequence) {
    var s = sequence;
    var pair;
    var result = {
        pairs: [],
        locations: {}
    };
    var pairRegex = "\\+([\\^A-Z][1-4][A-Z][1-4])";
    var locationRegex =
            "\\((-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*)\\)";
    var regex = "^" + pairRegex + locationRegex;
    var match;
    var fullMatch;
    var newNodeId;
    var encodedLocation;
    var location;
    while (s !== "") {
        match = s.match(regex);
        if (match === null) {
            return {error: "bad sequence `" + sequence + "`"};
        }
        fullMatch = match[0];
        pair = match[1];
        result.pairs.push(pair);

        newNodeId = pair.charAt(2);
        encodedLocation = match.splice(2);
        location = parseEncodedLocation(encodedLocation);
        if (location === null) {
            return {error: "bad location in `" + fullMatch + "`"};
        }
        result.locations[newNodeId] = location;

        addPairWithLocation(fullMatch.substr(1));

        s = s.substr(fullMatch.length + 1);
    }
    return result;
};

var getFitness = function (params) {
    if (params.length < 1) {
        return {error: "incomplete fitness parameters"};
    }

    var result = parseSequence(params[0]);

    requestFitness();

    return result;
};

var parseFitnessMessage = function (message) {
    var data = JSON.parse(message.utf8Data);
    if (data.type !== "fitness") {
        return null;
    }
    var fitness = parseFloat(data.text);
    if (Number.isNaN(fitness)) {
        return null;
    }
    return fitness;
};

var writeResult = function (response, result) {
    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
};

var apiPort = 8081;
var httpServer = http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var pathElements = pathName.split("/");
    var result;
    var exampleQuery = "/fitness/+^1D3(1.5,1.2,-3.4),+D2B2(-.5,1,4.)";

    pathElements.shift();
    pathElements = pathElements.map(function (el) {
        return decodeURIComponent(el);
    });

    if (pathElements.length === 0) {
        result = {error: "missing parameters"};
        writeResult(response, result);
        return;
    }

    var functionName = pathElements[0];
    if (functionName === "fitness") {
        webSocket.onMessage(function (message) {
            var fitness = parseFitnessMessage(message);
            if (fitness === null) {
                result = {error: "failure retrieving fitness"};
            } else {
                result.fitness = fitness;
            }
            writeResult(response, result);
        });
        result = getFitness(pathElements.splice(1));
        if (resultDescribesAnError(result)) {
            result.exampleQuery = exampleQuery;
            writeResult(response, result);
        }
        return;
    }

    result = {error: "unknown API function `" + functionName + "`"};
    result.exampleQuery = exampleQuery;
    writeResult(response, result);
}).listen(apiPort, function () {
    cli.log("API is listening on port " + apiPort + " (HTTP)");
});

webSocket.create(httpServer);
