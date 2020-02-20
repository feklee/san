// Interface to browser by WebSockets

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var cli = require("./cli");
var audioModules = require("./audio-modules");
var sendColorsToNode = require("./send-colors-to-node");
var latestGraph = "";
var connectionSet = new Set();
var settings;

var broadcast = function (message) {
    if (connectionSet.size === 0) {
        return;
    }
    message.connectionType = settings.connectionTypeToInject;
    const json = JSON.stringify(message);
    cli.log("Broadcasting: " + json);
    connectionSet.forEach((c) => c.sendUTF(json));
};

var interpretMessage = function (message) {
    if (message.type !== "utf8") {
        return;
    }

    var data = JSON.parse(message.utf8Data);
    switch (data.type) {
    case "audio module":
        audioModules.store(data);
        broadcast(data);
        break;
    case "graph":
        latestGraph = data;
        broadcast(data);
        break;
    case "node colors":
        sendColorsToNode(data);
        broadcast(data);
        break;
    }
};

var sendAudioModules = function (connection) {
    audioModules.forEach(function (audioModule) {
        connection.sendUTF(JSON.stringify(audioModule));
    });
};

var sendLatestGraph = function (connection) {
    connection.sendUTF(JSON.stringify(latestGraph));
};

var onNewConnection = function (connection) {
    connectionSet.add(connection);

    connection.on("message", function (message) {
        interpretMessage(message);
    });

    connection.on("close", function () {
        cli.log("WebSocket connection closed");
        connectionSet.delete(connection);
    });

    sendAudioModules(connection);
    sendLatestGraph(connection);
};

function create(x) {
    settings = x;
    var wsServer = new WebSocketServer({
        httpServer: settings.httpServer,
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
