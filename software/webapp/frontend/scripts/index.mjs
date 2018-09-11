/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import settings from "./settings.mjs";
import visualization from "./visualization.mjs";
import nodes from "./nodes.mjs";

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

    var parentNodeId = a[0];
    var parentPortNumber = parseInt(a[1]);
    var parentNode = nodes[parentNodeId];
    if (parentNode === undefined) {
        return;
    }

    var childNodeId = a[2];
    var childPortNumber = parseInt(a[3]);
    var childNode = nodes[childNodeId];
    if (childNode === undefined) {
        childNode = nodeManager.addNode(childNodeId);
    }

    var pair = {
        parentPort: {
            node: parentNode,
            portNumber: parentPortNumber
        },
        childPort: {
            node: childNode,
            portNumber: childPortNumber
        }
    };

    if (nodeManager.connectionExists(pair)) {
        nodeManager.refreshConnection(pair);
    } else {
        nodeManager.connect(pair);
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
