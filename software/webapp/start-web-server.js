/*jslint node: true, maxlen: 80 */

"use strict";

var http = require("http");
var nodeStatic = require("node-static");
var fileServer = new nodeStatic.Server("./frontend/build", {cache: 0});
var webSocket = require("./web-socket");
var cli = require("./cli");
var port = 8080;

module.exports = function (onListening) {
    var httpServer = http.createServer(function (request, response) {
        request.addListener("end", function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);

    httpServer.listen(port, function () {
        cli.log("HTTP server is listening on port " + port);
        if (onListening !== undefined) {
            onListening();
        }
    });

    webSocket.create(httpServer);
};
