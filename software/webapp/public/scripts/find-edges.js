/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.js";

export default function () {
    var processedNodes = [];
    var connections = [];

    Object.values(nodes).forEach(function (node) {
        Object.values(node.connectedNodes).forEach(function (connectedNode) {
            if (connectedNode === null) {
                return;
            }
            var connectionAlreadyFound =
                    processedNodes.indexOf(connectedNode) !== -1;
            if (connectionAlreadyFound) {
                return;
            }
            connections.push({
                node: node,
                connectedNode: connectedNode
            });
        });
        processedNodes.push(node);
    });
    return connections;
};
