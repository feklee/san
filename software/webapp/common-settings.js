/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval;
var connectionExpiryDuration;

try {
    var data = fs.readFileSync("../common_settings", "utf8");
    eval(data);
} catch (ignore) {
    cli.logError("Cannot find load common settings");
}

module.exports = {
    graphUpdateInterval: graphUpdateInterval,
    connectionExpiryDuration: connectionExpiryDuration
};
