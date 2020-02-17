/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval = 0;
var connectionExpiryDuration = 0;

var assertPositive = function (setting, value) {
    if (!(value > 0)) {
        cli.logError("Invalid " + setting);
        process.exit(1);
    }
};

var extractDefines = function (cData) {
    var definesInC =
        cData.match(new RegExp(
            "^\\s*#define\\s+" +
                "(graphUpdateInterval|connectionExpiryDuration)" +
                ".*",
            "gm"
        ));
    var assignmentsInJs = definesInC.map(
        function (defineInC) {
            return defineInC
                .replace(/\/\/.*/g, "")
                .replace(/#define\s+([\w]+)\s+(.*)/g, "$1 = $2;");
        });
    var jsData = assignmentsInJs.join("\n");
    eval(jsData);
    assertPositive("graphUpdateInterval", graphUpdateInterval);
    assertPositive("connectionExpiryDuration", connectionExpiryDuration);
};

try {
    var cData = fs.readFileSync(
        "../hardware/life_size/nodes/ArduinoFirmware/sharedSettings.h",
        "utf8");
    extractDefines(cData);
} catch (ignore) {
    cli.logError("Cannot load shared settings");
    process.exit(1);
}

module.exports = {
    graphUpdateInterval: graphUpdateInterval,
    connectionExpiryDuration: connectionExpiryDuration
};
