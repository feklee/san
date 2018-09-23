/*jslint node: true, maxlen: 80 */

"use strict";

const SerialPort = require("serialport");

SerialPort.list(function (ignore, ports) {
    var comNames = ports.map(function (port) {
        return port.comName;
    });
    comNames.sort();
    comNames.forEach(function (comName) {
        console.log(comName);
    });
});
