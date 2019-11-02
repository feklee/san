/*jslint node: true, maxlen: 80 */

"use strict";

module.exports = function (pair) {
    return /^[a-zA-Z\^][1-4][a-zA-Z][1-4]$/.test(pair);
};
