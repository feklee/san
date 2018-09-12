/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval;
var connectionExpiryDuration;

try {
    var cData = fs.readFileSync("../common_settings.h", "utf8");
    var jsData = cData.replace(/const\s+[^\s]+/g, "var");
    eval(jsData);
} catch (ignore) {
    cli.logError("Cannot load common settings");
    process.exit(1);
}

module.exports = {
    graphUpdateInterval: graphUpdateInterval,
    connectionExpiryDuration: connectionExpiryDuration
};
