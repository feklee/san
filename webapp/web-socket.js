// Interface to browser by WebSockets

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var cli = require("./cli");
var connection;
var messageCallback;

function send(message) {
    if (connection !== undefined) {
        connection.sendUTF(JSON.stringify(message));
    }
}

function create(httpServer) {
    var wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.on("request", function (request) {
        connection = request.accept(null, request.origin);
        cli.log("WebSocket connection from browser accepted");
        connection.on("message", function (message) {
            messageCallback(message);
        });
    });
}

function onMessage(callback) {
    messageCallback = callback;
}

module.exports = {
    create: create,
    send: send,
    onMessage: onMessage
};
