/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var receivedDataItems = require("./received-data-items");
var cli = require("./cli");

startWebServer(function () {
    cli.enableInput(function (data) {
        var message = {type: "data", text: data};
        webSocket.send(message);
        receivedDataItems.push(data);
    });
});
