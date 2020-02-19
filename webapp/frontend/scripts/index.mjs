/*jslint browser: true, maxlen: 80 */

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import nodes from "./nodes.mjs";
import audio from "./audio.mjs";
import webSocket from "./web-socket.mjs";
import sendGraph from "./send-graph.mjs";
import settings from "./settings.mjs";
import {parseNodeColorsMessage} from "./colors.mjs";

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

var parseData = function (data) {
    var a = data.split("");
    var encodedTiltAngle = data.substr(4);
    var tiltAngle = decodeAngle(encodedTiltAngle); // rad

    log.append("data", data.substr(0, 4), tiltAngle);

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

webSocket.setup({
    onerror: function () {
        log.append("error", "WebSocket error");
    },
    onopen: function () {
        log.append("info", "WebSocket opened");
        setInterval(sendGraph, settings.sendGraphInterval);
    },
    onclose: function () {
        log.append("warn", "WebSocket closed");
    },
    onmessage: function (e) {
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
        } else if (message.type === "audio module") {
            log.append(
                "info",
                "audio module update for " + message.nodeId
            );
            audio.parseModuleMessage(message);
        } else if (message.type === "node colors") {
            log.append(
                "info",
                "color update for " + message.nodeId
            );
            parseNodeColorsMessage(message);
        } else if (message.type !== "graph") {
            log.append(message.type, message.text);
        }
    }
});

webSocket.connect();

document.body.classList.remove("hidden");

audio.enableMuteButton();
