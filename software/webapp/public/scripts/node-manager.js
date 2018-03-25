/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import visualize from "./visualize.js";
import nodes from "./nodes.js";
import sortedNodes from "./sorted-nodes.js";
import settings from "./settings.js";
import renderMatrix from "./render-matrix.js";
import optimizeLocations from "./optimize-locations.js";
var rootNode;

var nodeExists = function (id) {
    return nodes[id] !== undefined;
};

var addNode = function (id) {
    if (nodeExists(id)) {
        return;
    }
    var node = {
        id: id,
        connectedNodes: [null, null, null, null],
        location: null,
        color: null
    };

    node.color = settings.nodeColors[id];
    if (node.color === undefined) {
        node.color = settings.defaultNodeColor;
    }

    nodes[id] = node;

    return node;
};

// See article "Generating uniformly distributed numbers on a sphere":
// http://corysimon.github.io/articles/uniformdistn-on-sphere/
var randomUnitVector = function () {
    var theta = 2 * Math.PI * Math.random();
    var phi = Math.acos(1 - 2 * Math.random());

    return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi));
};

var locationAtRandomOrientation = function (origin) {
    return origin.clone().add(randomUnitVector());
};

var setLocation = function (originNode, node) {
    if (originNode.location === null) {
        return;
    }

    var nodeAlreadyHasLocation = node.location !== null;
    if (nodeAlreadyHasLocation) {
        return;
    }

    node.location = locationAtRandomOrientation(originNode.location);
};

var connect = function (ports) {
    if (!nodeExists(ports[0].nodeId) || !nodeExists(ports[1].nodeId)) {
        return;
    }

    var node = nodes[ports[0].nodeId];
    var nodeToConnect = nodes[ports[1].nodeId];

    node.connectedNodes[ports[0].portNumber - 1] = nodeToConnect;
    nodeToConnect.connectedNodes[ports[1].portNumber - 1] = node;

    setLocation(node, nodeToConnect);
};

var findNodesConnectedToRoot = function () {
    var nodesConnectedToRoot = new Set();

    var findNodesConnectedToNode;
    findNodesConnectedToNode = function (node) {
        var nodeAlreadyProcessed = nodesConnectedToRoot.has(node);
        if (nodeAlreadyProcessed) {
            return;
        }
        nodesConnectedToRoot.add(node);
        node.connectedNodes.forEach(function (connectedNode) {
            if (connectedNode !== null) {
                findNodesConnectedToNode(connectedNode);
            }
        });
    };

    findNodesConnectedToNode(rootNode);

    return nodesConnectedToRoot;
};

var nullConnectionsToRemovedNodes = function () {
    Object.values(nodes).forEach(function (node) {
        node.connectedNodes.forEach(function (connectedNode, i) {
            if (connectedNode === null) {
                return;
            }
            var isRemoved = nodes[connectedNode.id] !== undefined;
            if (!isRemoved) {
                node.connectedNodes[i] = null;
            }
        });
    });
};

var removeNodesNotConnectedToRoot = function () {
    var nodesConnectedToRoot = findNodesConnectedToRoot();
    Object.values(nodes).forEach(function (node) {
        var isConnectedToRoot = nodesConnectedToRoot.has(node);
        if (!isConnectedToRoot) {
            delete nodes[node.id];
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
};

var sortNodes = function () {
    sortedNodes.length = 0;
    var sortedNodeIds = Object.keys(nodes).sort();
    sortedNodeIds.forEach(function (nodeId) {
        sortedNodes.push(nodes[nodeId]);
    });
};

var updateConnection = function (ports) {
    if (ports[1].nodeId === "_") {
        disconnect(ports[0]);
    } else {
        connect(ports);
    }
    removeNodesNotConnectedToRoot();
    nullConnectionsToRemovedNodes();
    sortNodes();
    renderMatrix();
    optimizeLocations();
    visualize();
};

var addRootNode = function () {
    rootNode = addNode("*");
    rootNode.location = new THREE.Vector3(0, 0, 0);
};

addRootNode();
sortNodes();

export default {
    addNode: addNode,
    updateConnection: updateConnection
};
