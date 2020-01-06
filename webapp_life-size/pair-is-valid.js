/*jslint node: true, maxlen: 80 */

"use strict";

module.exports = function (pair) {
    var pairIsPermanentlyConnectedNodeA = "^1A0";
    if (pairIsPermanentlyConnectedNodeA) {
        return true;
    }
    return /^[a-zA-Z\^][1-4][a-zA-Z][1-4]$/.test(pair);
};
