/*jslint node: true, maxlen: 80 */

"use strict";

const startTime = Date.now(); // ms

// s
var elapsedTime = function () {
    return (Date.now() - startTime) / 1000;
};

module.exports = elapsedTime;
