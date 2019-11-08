/*jslint node: true, maxlen: 80 */

"use strict";

const fs = require("fs");
var cli = require("./cli");
var graphUpdateInterval = 0;
var connectionExpiryDuration = 0;

try {
    var cppData = fs.readFileSync(
        "../hardware/life_size/nodes/ArduinoFirmware/sharedSettings.h",
        "utf8");
    var assignmentsInCpp =
        cppData.match(new RegExp(
            "^\\s*const[^;]+" +
                "(graphUpdateInterval|connectionExpiryDuration)" +
                "\\s+=[^\\;]*;",
            "gm"
        ));
    var assignmentsInJs = assignmentsInCpp.map(
        function (assignmentInCpp) {
            return assignmentInCpp.replace(/const\s+[^\s]+/g, "");
        });
    var jsData = assignmentsInJs.join("\n");
    eval(jsData);
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
