// Interface to browser by WebSockets

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var receivedDataItems = require("./received-data-items");
var cli = require("./cli");
var connection;

function send(message) {
    if (connection !== undefined) {
        connection.sendUTF(JSON.stringify(message));
    }
}

function sendReceivedDataItems() {
    receivedDataItems.forEach(function (data) {
        var message = {type: "data", text: data};
        send(message);
    });
}

function create(httpServer) {
    var wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.on("request", function (request) {
        connection = request.accept(null, request.origin);
        cli.log("WebSocket connection from browser accepted");
        sendReceivedDataItems();
    });
}

module.exports = {
    create: create,
    send: send
};
