// Interface to browser

/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var browser = {};

browser.send = function (message) {
    if (browser.connection !== undefined) {
        browser.connection.sendUTF(JSON.stringify(message));
    }
};

module.exports = browser;
