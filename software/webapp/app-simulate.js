/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var receivedDataItems = require("./received-data-items");
var readline = require("readline");

startWebServer(function () {
    console.log("Now send data packages via standard input, line by line");
});

var readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

readlineInterface.on("line", function (data) {
    var message = {type: "data", text: data};
    webSocket.send(message);
    receivedDataItems.push(data);
});
