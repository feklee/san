/*jslint node: true, maxlen: 80 */

"use strict";

var rootNode = require("./root-node");

rootNode.listSerialPorts(
    function (ports) {
        var comNames = ports.map(function (port) {
            return port.comName;
        });
        comNames.sort();
        comNames.forEach(function (comName) {
            console.log(comName);
        });
    }
);
