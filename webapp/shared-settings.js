/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval = 0;
var connectionExpiryDuration = 0;
var gw; // WiFi gateway

var extractDefines = function (cData) {
    var assignmentsInC =
        cData.match(new RegExp(
            "^\\s*#define\\s+" +
                "(graphUpdateInterval|connectionExpiryDuration)" +
                ".*",
            "gm"
        ));
    var assignmentsInJs = assignmentsInC.map(
        function (assignmentInC) {
            return assignmentInC
                .replace(/\/\/.*/g, "")
                .replace(/#define\s+([\w]+)\s+(.*)/g, "$1 = $2;");
        });
    var jsData = assignmentsInJs.join("\n");
    return jsData;
};

var extractGw = function (cData) {
    var matches = cData.match(new RegExp("\\Wgw[^\\w{]*{([\\d\\s,]+)"));
    var s = matches[1];
    var gw = s.split(",").map((x) => parseInt(x.trim()));
    return gw;
};

try {
    var cData = fs.readFileSync(
        "../hardware/life_size/nodes/ArduinoFirmware/sharedSettings.h",
        "utf8");
    eval(extractDefines(cData));
    gw = extractGw(cData);
} catch (ignore) {
    cli.logError("Cannot load shared settings");
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
