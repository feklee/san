/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var items = [];
var browser = require("./browser");

var add = function (data) {
    items.push(data);
};

var send = function () {
//    ["*1B3", "*1_0", "*1B4", "B1F1", "F4C3", "B1_0", "F4C3", "B1F1", "F4C3", "F3A4", "C4E3"]. // todo: for debugging
    ["*1B4", "B1F1", "F4C3", "F3A4", "C4E3"]. // todo: for debugging
        forEach(function (data) {
        items.push(data);
    });

    items.forEach(function (data) {
        var message = {type: "data", text: data};
        browser.send(message);
    });
};

module.exports = {
    add: add,
    send: send
};
