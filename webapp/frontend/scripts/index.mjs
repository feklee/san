/*jslint browser: true, maxlen: 80 */

import log from "./log.mjs";
import nodeManager from "./node-manager.mjs";
import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";
import nodeColors from "./node-colors.mjs";
import edges from "./edges.mjs";
import audio from "./audio.mjs";
import webSocket from "./web-socket.mjs";
import colorConvert from "color-convert";

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

var dupElements = function (array) {
    return array.reduce((res, el) => res.concat([el, el]), []);
};

var colorsOfNode = function (node) {
    return dupElements(
        nodeColors(node.id).map(colorConvert.keyword.rgb)
    );
};

webSocket.setup({
    onerror: function () {
        log.append("error", "WebSocket error");
    },
    onopen: function () {
        log.append("info", "WebSocket opened");

        setInterval(function () {
            var ns = visibleNodes;
            var es = Array.from(edges);

            var data = {
                type: "graph",
                nodeIds: ns.map((n) => n.id),
                nodePoints: ns.map((n) => n.animatedLocation.toArray()),
                nodeColors: ns.map(colorsOfNode),
                edgeLines: es.map((e) =>
                                  Array.from(e.nodes).map((n) =>
                                                          n.animatedLocation.toArray())),
                nodeTiltAngles: [] // TODO: implement
            };

            console.log(data); // TODO: remove
            var json = JSON.stringify(data, function(key, val) {
                return val.toFixed ? Number(val.toFixed(3)) : val;
            });
            console.log(json); // TODO: remove
            webSocket.send(json);
        }, 1000);
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
        } else {
            log.append(message.type, message.text);
        }
    }
});

webSocket.connect();

document.body.classList.remove("hidden");

audio.enableMuteButton();
