// Interface to root node

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: "\r\n"
});
var browser = require("./browser");
var receivedDataItems = require("./received_data_items");
var port;

function listSerialPorts(callback) {
    SerialPort.list(function (ignore, ports) {
        callback(ports);
    });
}

function log(message) {
    if (message.type === "error" || message.type === "warn") {
        console.error(message.text);
    } else {
        console.log(message.text);
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
        browser.send(message);
        settings.onConnected();
    });
    port.on("close", function () {
        var message = {type: "warn", text: "Serial port closed"};
        log(message);
        browser.send(message);
    });
    port.on("error", function () {
        var message = {type: "error", text: "Serial port error"};
        log(message);
        browser.send(message);
    });
    port.on("disconnected", function () {
        var message = {type: "warn", text: "Serial port disconnected"};
        log(message);
        browser.send(message);
    });
    parser.on("data", function (data) {
        var message = {type: "data", text: data};
        log(message);
        browser.send(message);
        receivedDataItems.add(data);
    });
}

function sendJson(modeChainJson) {
    port.write(modeChainJson);
}

module.exports = {
    listSerialPorts: listSerialPorts,
    connect: connect,
    sendJson: sendJson
};