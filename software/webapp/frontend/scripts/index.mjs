/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import settings from "./settings.mjs";
import visualization from "./visualization.mjs";

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
    var parentPort = {
        nodeId: a[0], // TODO: maybe put node here righ away
        portNumber: parseInt(a[1])
    };
    var childPort = {
        nodeId: a[2],
        portNumber: parseInt(a[3])
    };

    if (!nodeManager.nodeExists(parentPort.nodeId)) {
        return;
    }

    if (!nodeManager.nodeExists(childPort.nodeId)) {
        nodeManager.addNode(childPort.nodeId);
    }

    if (nodeManager.connectionExists([parentPort, childPort])) {
        nodeManager.refreshConnection([parentPort, childPort]);
    } else {
        nodeManager.connect([parentPort, childPort]);
    }
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

var asideEl = document.querySelector("aside");
asideEl.style.width = settings.asideWidth + "px";
document.body.classList.remove("hidden");
