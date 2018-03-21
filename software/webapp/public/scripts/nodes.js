/*jslint browser: true, maxlen: 80 */

var nodes = {};

var nodeExists = function (id) {
    return nodes[id] !== undefined;
};

nodes.add = function (id) {
    if (nodeExists(id)) {
        return;
    }
    nodes[id] = {
        id: id,
        connectedNodes: [null, null, null, null]
    };
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
    Object.keys(nodes).forEach(function (key) {
        var entryIsNode = key.length === 1;
        if (entryIsNode) {
            var nodeId = key;
            var node = nodes[nodeId];
            var isRootNode = nodeId === "*";
            if (isRootNode) {
                return;
            }
            if (hasNoConnectedNodes(node)) {
                delete nodes[nodeId];
            }
        }
    });
};

var removeConnectedNode = function (node, nodeToRemove) {
    node.connectedNodes.forEach(function (connectedNode, i) {
        if (connectedNode !== null && connectedNode.id === nodeToRemove.id) {
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
    removeConnectedNode(connectedNode, node);
    removeUnconnectedNodes();
};

nodes.updateConnection = function (ports) {
    if (ports[1].nodeId === "_") {
        disconnect(ports[0]);
        return;
    }

    connect(ports);
};

nodes.add("*");

export default nodes;
