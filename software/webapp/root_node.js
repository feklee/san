// Interface to root node

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: "\r\n"
});

var port;
var browserConnection;

function listSerialPorts(callback) {
    SerialPort.list(function (ignore, ports) {
        callback(ports);
    });
}

function sendToBrowser(message) {
    if (browserConnection !== undefined) {
        browserConnection.sendUTF(JSON.stringify(message));
    }
}

function log(message) {
    if (message.type === "error" || message.type === "warn") {
        console.error(message.text);
    } else {
        console.log(message.text);
    }

    if (browserConnection === undefined) {
        return;
    }
}

function connect(settings) {
    port = new SerialPort(settings.comName, {
        baudRate: 115200
    });
    port.pipe(parser);
    port.on("open", function () {
        var message = {type: "info", text: "Serial port opened"};
        log(message);
        sendToBrowser(message);
        settings.onConnected();
    });
    port.on("close", function () {
        var message = {type: "warn", text: "Serial port closed"};
        log(message);
        sendToBrowser(message);
    });
    port.on("error", function () {
        var message = {type: "error", text: "Serial port error"};
        log(message);
        sendToBrowser(message);
    });
    port.on("disconnected", function () {
        var message = {type: "warn", text: "Serial port disconnected"};
        log(message);
        sendToBrowser(message);
    });
    parser.on("data", function (data) {
        var message = {type: "data", text: data};
        log(message);
        sendToBrowser(message);
    });
}

function sendJson(modeChainJson) {
    port.write(modeChainJson);
}

module.exports = {
    set browserConnection(newBrowserConnection) {
        browserConnection = newBrowserConnection;
    },
    listSerialPorts: listSerialPorts,
    connect: connect,
    sendJson: sendJson
};
