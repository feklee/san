/*jslint browser: true, maxlen: 80 */

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import settings from "./settings.mjs";
import nodes from "./nodes.mjs";
import locationOptimizer from "./location-optimizer";

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
    var regex =
            "^\\((-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*),(-?[0-9]*.?[0-9]*)\\)";
    var match = encodedLocation.match(regex);
    if (match === 0) {
        return null;
    }
    var x = parseFloat(match[1]);
    var y = parseFloat(match[2]);
    var z = parseFloat(match[3]);
    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
        return null;
    }
    return [x, y, z];
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

    if (nodeManager.nodeIsRootNode(parentNodeId)) {
        nodeManager.clear();
    }

    var childNodeId = a[2];
    var childPortNumber = parseInt(a[3]);
    var childNode = nodes[childNodeId];
    if (childNode === undefined) {
        childNode = nodeManager.addNode(childNodeId, tiltAngle, location);
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

    if (!nodeManager.connectionExists(pair)) {
        nodeManager.connect(pair);
    }
};

var returnFitness = function () {
    var fitness = locationOptimizer.currentFitness();
    client.send(JSON.stringify({
        type: "fitness",
        text: fitness
    }));
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

    switch (message.type) {
    case "data":
        parseData(message.text);
        break;
    case "fitness":
        log.append(message.type, message.text);
        returnFitness();
        break;
    default:
        log.append(message.type, message.text);
    }
};

var asideEl = document.querySelector("aside");
asideEl.style.width = settings.asideWidth + "px";
document.body.classList.remove("hidden");
