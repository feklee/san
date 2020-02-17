/*jslint node: true, maxlen: 80 */

"use strict";

var http = require("http");
var nodeStatic = require("node-static");
var fileServer = new nodeStatic.Server("./frontend/public", {cache: 0});
var webSocket = require("./web-socket");
var cli = require("./cli");
var port = 8080;
var settings;

module.exports = function (x) {
    settings = x;
    var httpServer = http.createServer(function (request, response) {
        var nodeRegExp = new RegExp("^/[a-z0-9]$", "i");
        if (request.url.match(nodeRegExp)) {
            fileServer.serveFile(
                "node-ui.html",
                200,
                {},
                request,
                response
            );
            return;
        }
        request.addListener("end", function () {
            fileServer.serve(request, response);
        }).resume();
    });

    httpServer.listen(port, function () {
        cli.log("HTTP server is listening on port " + port);
        if (settings.onListening !== undefined) {
            settings.onListening();
        }
    });

    webSocket.create({
        httpServer: httpServer,
        connectionTypeToInject: settings.connectionTypeToInject
    });
};
