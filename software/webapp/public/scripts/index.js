/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import log from "./log.js";
import matrix from "./matrix.js";
import nodeManager from "./node-manager.js";
import settings from "./settings.js";

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

var parseData = function (data) {
    var a = data.split("");
    var existingNodeId = a[0];
    var existingNodePort = parseInt(a[1]);
    var newNodeId = a[2];
    var newNodePort = parseInt(a[3]);
    if (newNodeId !== "_") {
        nodeManager.addNode(newNodeId);
    }
    nodeManager.updateConnection([{
        nodeId: existingNodeId,
        portNumber: existingNodePort
    }, {
        nodeId: newNodeId,
        portNumber: newNodePort
    }]);
};

client.onmessage = function (e) {
    var message;
    var json;
    if (typeof e.data === "string") {
        json = e.data;
        message = JSON.parse(json);
    } else {
        return;
    }

    log.append(message.type, message.text);

    if (message.type === "data") {
        parseData(message.text);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    var asideEl = document.querySelector("aside");
    asideEl.style.width = settings.asideWidth + "px";
});
