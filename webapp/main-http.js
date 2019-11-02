/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var http = require("http");
var port = 8081;
var pairIsValid = require("./pair-is-valid");

var logInfo = function () {
    console.log("HTTP server to receive pairs is listening on port " + port);
};

var broadcastPair = function (pair) {
    var message = {type: "data", text: pair};
    webSocket.broadcast(message);
};

var processUrl = function (url) {
    var pair = url.substring(1);
    if (!pairIsValid(pair)) {
        console.error("Received invalid pair: " + pair);
        return;
    }
    console.log("Received pair: " + pair);
    broadcastPair(pair);
};

var startCommandHttpServer = function () {
    var commandHttpServer = http.createServer(function (request, response) {
        response.writeHead(204);
        response.end();
        processUrl(request.url);
    });

    commandHttpServer.listen(port, logInfo);
};

startWebServer(startCommandHttpServer);
