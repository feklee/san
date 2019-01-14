/*jslint browser: true, maxlen: 80 */

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import settings from "./settings.mjs";
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

var angleInRad = function ( // rad
    angleInDeg // deg
) {
    return Math.PI * angleInDeg / 180;
};

var decodeAngle = function (encodedAngle) { // rad
    var x = parseInt(encodedAngle, 16);
    var noAngleIsSet = Number.isNaN(x) || x < 1 || x > 127;

    if (noAngleIsSet) {
        return null;
    }

    var angleInDeg = Math.round((x - 1) * 180 / 126); // [1, 127] -> [0, 180]
    return angleInRad(angleInDeg);
};

var decodeLocation = function (encodedLocation) {
    return [0, 0, 0];
};

var parseData = function (data) {
    var a = data.split("");
    var tiltAngle = null; // rad
    var encodedLocation = data.substr(4);
    var location = decodeLocation(encodedLocation);

    log.append("data", data.substr(0, 4), tiltAngle, location);

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
        childNode = nodeManager.addNode(childNodeId, tiltAngle);
    } else {
        childNode.tiltAngle = tiltAngle;
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

    if (message.type === "data") {
        parseData(message.text);
    } else {
        log.append(message.type, message.text);
    }
};

var asideEl = document.querySelector("aside");
asideEl.style.width = settings.asideWidth + "px";
document.body.classList.remove("hidden");
