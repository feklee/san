// Interface to microcontroller, for measuring and controlling the hardware

/*jslint node: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: "\n"
});

var log = require("./log");
var port;

function listSerialPorts(callback) {
    SerialPort.list(function (ignore, ports) {
        callback(ports);
    });
}

function connect(settings) {
    port = new SerialPort(settings.comName, {
        baudRate: 9600
    });
    port.pipe(parser);
    port.on("open", function () {
        log.appendInfo("Serial port opened");
        settings.onConnected();
    });
    port.on("close", function () {
        log.appendWarn("Serial port closed");
    });
    port.on("error", function () {
        log.appendError("Serial port error");
    });
    port.on("disconnected", function () {
        log.appendWarn("Serial port disconnected");
    });
    parser.on("data", function (json) {
        var data;
        try {
            data = JSON.parse(json);
        } catch (e) {
            if (e.name === "SyntaxError") {
                log.appendError("Non JSON data from microcontroller");
                console.log(json);
                return;
            }
        }
        settings.onData(data);
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
