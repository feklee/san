/*jslint node: true, maxlen: 80 */

"use strict";

var WebSocketServer = require("websocket").server;
var http = require("http");
var rootNode = require("./root_node");
var args = process.argv.slice(2);
var browserConnection = null;
var nodeStatic = require("node-static");
var fileServer = new nodeStatic.Server("./public", {cache: 0});

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

function onConnectedToRootNode() {
    var port = 8080;
    var server = http.createServer(function (request, response) {
        request.addListener("end", function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);

    server.listen(port, function () {
        console.log("Server is listening on port " + port);
    });

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on("request", function (request) {
        browserConnection = request.accept(null, request.origin);
        console.log("Connection from browser accepted");
        rootNode.browserConnection = browserConnection;
    });
}

if (args.length === 0) {
    rootNode.listSerialPorts(
        function (ports) {
            console.log("Specify com port name as first argument");
            console.log("");
            console.log("Available ports:");
            ports.forEach(function (port) {
                console.log("");
                console.log("  * " + port.comName);
            });
            process.exit();
        }
    );
} else {
    rootNode.connect({
        comName: args[0],
        onConnected: onConnectedToRootNode
    });
}
