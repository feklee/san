// Serial interface to root node

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: "\r\n"
});
var webSocket = require("./web-socket");
var port;

function connect(settings) {
    port = new SerialPort(settings.comName, {
        baudRate: 115200
    });
    port.pipe(parser);
    port.on("open", function () {
        var message = {type: "info", text: "Serial port opened"};
        webSocket.broadcast(message);
        settings.onConnected();
    });
    port.on("close", function () {
        var message = {type: "warn", text: "Serial port closed"};
        webSocket.broadcast(message);
    });
    port.on("error", function () {
        var message = {type: "error", text: "Serial port error"};
        webSocket.broadcast(message);
        process.exit(1);
    });
    port.on("disconnected", function () {
        var message = {type: "warn", text: "Serial port disconnected"};
        webSocket.broadcast(message);
    });
    parser.on("data", function (data) {
        var message = {type: "data", text: data};
        webSocket.broadcast(message);
    });
}

module.exports = {
    connect: connect
};
