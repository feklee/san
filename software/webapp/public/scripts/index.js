/*jslint browser: true, maxlen: 80 */

import log from "./log.js";

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");

client.onerror = function () {
    log.append("error", "WebSocket error");
};

client.onopen = function () {
    log.append("info", "WebSocket opened");
};

client.onclose = function () {
    log.append("warn", "WebSocket closed");
};

client.onmessage = function (e) {
    var data;
    var json;
    if (typeof e.data === "string") {
        json = e.data;
        data = JSON.parse(json);
    } else {
        return;
    }

    log.append(data.type, data.text);
};
