/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var readline = require("readline");
var elapsedTime = require("./elapsed-time");
var physicalConnection = require("./physical-connection");

physicalConnection.type = "simulation";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var it = rl[Symbol.asyncIterator]();

var readNextLine;

var broadcastOnceTimeHasElapsed = function (targetTime, message) {
    if (elapsedTime() >= targetTime) {
        webSocket.broadcast(message);
        readNextLine();
        return;
    }
    setTimeout(() => broadcastOnceTimeHasElapsed(targetTime, message), 0);
};

var interpretLine = function (line) {
    var matches = line.match(/^\[([0-9.]+)\]\sBroadcasting:\s(.*)$/);
    if (matches === null) {
        readNextLine();
        return;
    }

    const targetTime = parseFloat(matches[1]); // s
    const json = matches[2];
    const message = JSON.parse(json);

    broadcastOnceTimeHasElapsed(targetTime, message);
};

readNextLine = async function () {
    const result = await it.next();
    var line = result.value;
    if (result.done) {
        return;
    }
    interpretLine(line);
};

startWebServer(function () {
    readNextLine();
});
