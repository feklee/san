/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import visualize from "./visualize.js";
import nodes from "./nodes.js";

var nodeExists = function (id) {
    return nodes[id] !== undefined;
};

var addNode = function (id) {
    if (nodeExists(id)) {
        return;
    }
    nodes[id] = {
        id: id,
        connectedNodes: [null, null, null, null],
        location: null, // todo: initialize with THREE.Vector3 when connecting, in distance 10 (configurable)
        color: "gray"
    };
    return nodes[id];
};

var connect = function (ports) {
    if (!nodeExists(ports[0].nodeId) || !nodeExists(ports[1].nodeId)) {
        return;
    }

    nodes[ports[0].nodeId].connectedNodes[ports[0].portNumber - 1] =
            nodes[ports[1].nodeId];
    nodes[ports[1].nodeId].connectedNodes[ports[1].portNumber - 1] =
            nodes[ports[0].nodeId];
};

var hasNoConnectedNodes = function (node) {
    var result = node.connectedNodes.find(function (connectedNode) {
        return connectedNode !== null;
    });
    return result === undefined;
};

var removeUnconnectedNodes = function () {
    Object.keys(nodes).forEach(function (nodeId) {
        var node = nodes[nodeId];
        var isRootNode = nodeId === "*";
        if (isRootNode) {
            return;
        }
        if (hasNoConnectedNodes(node)) {
            delete nodes[nodeId];
        }
    });
};

var disconnectNode = function (node, nodeToDisconnect) {
    if (node === null) {
        return;
    }
    node.connectedNodes.forEach(function (connectedNode, i) {
        if (connectedNode !== null &&
            connectedNode.id === nodeToDisconnect.id) {
            node.connectedNodes[i] = null;
        }
    });
};

var disconnect = function (port) {
    var nodeId = port.nodeId;

    if (!nodeExists(nodeId)) {
        return;
    }

    var node = nodes[nodeId];
    var connectedNode = node.connectedNodes[port.portNumber - 1];

    node.connectedNodes[port.portNumber - 1] = null;
    disconnectNode(connectedNode, node);
    removeUnconnectedNodes();
};

var updateConnection = function (ports) {
    if (ports[1].nodeId === "_") {
        disconnect(ports[0]);
        console.log(nodes);
        return;
    }

    connect(ports);
    console.log(nodes);
    visualize();;
};

var addRootNode = function () {
    var node = addNode("*");
    node.location = new THREE.Vector3(0, 0, 0);
};

addRootNode();

export default {
    addNode: addNode,
    updateConnection: updateConnection
};
