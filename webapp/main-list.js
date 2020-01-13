/*jslint node: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");

SerialPort.list().then(
    function (ports) {
        var comNames = ports.map(function (port) {
            return port.path;
        });
        comNames.sort();
        comNames.forEach(function (comName) {
            console.log(comName);
        });
    }
);
