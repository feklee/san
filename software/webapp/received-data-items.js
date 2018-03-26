/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var items = [];
var webSocket = require("./web-socket.js");

var add = function (data) {
    items.push(data);
};

var send = function () {
    items.forEach(function (data) {
        var message = {type: "data", text: data};
        webSocket.send(message);
    });
};

module.exports = {
    add: add,
    send: send
};
