// Interface to browser by WebSockets

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var receivedDataItems = require("./received-data-items");
var connection;

function create(httpServer) {
    var wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.on("request", function (request) {
        connection = request.accept(null, request.origin);
        console.log("WebSocket connection from browser accepted");
        receivedDataItems.send();
    });
}

function send(message) {
    if (connection !== undefined) {
        connection.sendUTF(JSON.stringify(message));
    }
}

module.exports = {
    create: create,
    send: send
};
