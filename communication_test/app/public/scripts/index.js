/*jslint browser: true, maxlen: 80 */

import log from "./log.js";

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");

client.onerror = function () {
    log.appendError("WebSocket error");
};

client.onopen = function () {
    log.appendInfo("WebSocket opened");
};

client.onclose = function () {
    log.appendWarn("WebSocket closed");
};

client.onmessage = function (e) {
    if (typeof e.data !== "string") {
        return;
    }
    var json = e.data;
    var data = JSON.parse(json);
    log.appendError(data.value);
};
