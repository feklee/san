/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var items = [];
var browser = require("./browser");

var add = function (data) {
    items.push(data);
};

var send = function () {
    items.forEach(function (data) {
        var message = {type: "data", text: data};
        browser.send(message);
    });
};

module.exports = {
    add: add,
    send: send
};
