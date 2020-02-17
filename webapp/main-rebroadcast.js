/*jslint node: true, maxlen: 80 */

"use strict";

var startWebServer = require("./start-web-server");
var webSocket = require("./web-socket");
var cli = require("./cli");
var readline = require("readline");
var elapsedTime = require("./elapsed-time");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var it = rl[Symbol.asyncIterator]();

var readNextLine;

var broadcastOnceTimeHasElapsed = function (targetTime, json) {
    if (elapsedTime() >= targetTime) {
        console.log("Broadcasting:", json);
        // TODO        webSocket.broadcast(message);
        readNextLine();
        return;
    }
    setTimeout(() => broadcastOnceTimeHasElapsed(targetTime, json), 0);
};

var interpretLine = function (line) {
    var matches = line.match(/^\[([0-9.]+)\]\sBroadcasting:\s(.*)$/);
    if (matches === null) {
        readNextLine();
        return;
    }

    var targetTime = parseFloat(matches[1]); // s
    var json = matches[2];

    broadcastOnceTimeHasElapsed(targetTime, json);
};

readNextLine = async function () {
    const result = await it.next();
    var line = result.value;
    interpretLine(line);
};

startWebServer(function () {
    readNextLine();
});
