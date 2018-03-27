/*jslint node: true, maxlen: 80 */

"use strict";

var readline = require("readline");
var inputIsEnabled = false;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var log = function (text) {
    if (inputIsEnabled) {
        console.log();
    }
    console.log(text);
    if (inputIsEnabled) {
        rl.prompt();
    }
};

var logError = function (text) {
    if (inputIsEnabled) {
        console.log();
    }
    console.error(text);
    if (inputIsEnabled) {
        rl.prompt();
    }
};

var enableInput = function (onData) {
    inputIsEnabled = true;
    rl.setPrompt("Enter data: ");
    rl.prompt();
    rl.on("line", function (data) {
        onData(data);
        rl.prompt();
    });
};

module.exports = {
    enableInput: enableInput,
    log: log,
    logError: logError
};
