/*jslint node: true, maxlen: 80 */

"use strict";

var readline = require("readline");
var inputIsEnabled = false;
const startTime = Date.now(); // ms

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// s
var elapsedTime = function () {
    return (Date.now() - startTime) / 1000;
};

var timeStamp = function () {
    return "[" + elapsedTime().toFixed(3) + "]";
};

var log = function (text) {
    if (inputIsEnabled) {
        console.log();
    }
    console.log(timeStamp(), text);
    if (inputIsEnabled) {
        rl.prompt();
    }
};

var logError = function (text) {
    if (inputIsEnabled) {
        console.log();
    }
    console.error(timeStamp(), text);
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
