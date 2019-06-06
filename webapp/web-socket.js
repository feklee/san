// Interface to browser by WebSockets

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var cli = require("./cli");
var audioModules = require("./audio-modules");
var connectionSet = new Set();

var broadcast = function (message) {
    connectionSet.forEach((c) => c.sendUTF(JSON.stringify(message)));
};

var interpretMessage = function (message) {
    if (message.type !== "utf8") {
        return;
    }

    var data = JSON.parse(message.utf8Data);
    if (data.type === "audio module") {
        audioModules.store(data);
        broadcast(data);
    }
};

var broadcastAudioModules = function () {
    audioModules.forEach(function (audioModule) {
        broadcast(audioModule);
    });
};

var onNewConnection = function (connection) {
    connectionSet.add(connection);

    broadcastAudioModules();

    connection.on("message", function (message) {
        interpretMessage(message);
    });

    connection.on("close", function () {
        console.log("WebSocket connection closed");
        connectionSet.delete(connection);
    });
};

function create(httpServer) {
    var wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.on("request", function (request) {
        var connection = request.accept(null, request.origin);
        cli.log("WebSocket connection from browser accepted");
        onNewConnection(connection);
    });
}

module.exports = {
    create: create,
    broadcast: broadcast
};
