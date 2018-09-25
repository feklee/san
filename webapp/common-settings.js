/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval = 0;
var connectionExpiryDuration = 0;

try {
    var cData = fs.readFileSync("../nodes/Firmware/commonSettings.h",
                                "utf8");
    var jsData = cData.replace(/const\s+[^\s]+/g, "");
    eval(jsData);
} catch (ignore) {
    cli.logError("Cannot load common settings");
    process.exit(1);
}

module.exports = {
    graphUpdateInterval: graphUpdateInterval,
    connectionExpiryDuration: connectionExpiryDuration
};

Object.keys(module.exports).forEach(function (setting) {
    var value = module.exports[setting];
    if (!(value > 0)) {
        cli.logError("Invalid " + setting);
        process.exit(1);
    }
});
