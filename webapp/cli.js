/*jslint node: true, maxlen: 80 */

"use strict";

var readline = require("readline");
var elapsedTime = require("./elapsed-time");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var timeStamp = function () {
    return "[" + elapsedTime().toFixed(3) + "]";
};

var log = function (text) {
    console.error(timeStamp(), text);
};

var enableInput = function (onData) {
    rl.setPrompt("Enter data: ");
    rl.prompt();
    rl.on("line", function (data) {
        onData(data);
        rl.prompt();
    });
};

module.exports = {
    enableInput: enableInput,
    log: log
};
