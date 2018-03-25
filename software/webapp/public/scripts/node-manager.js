/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import visualize from "./visualize.js";
import nodes from "./nodes.js";
import edges from "./edges.js";
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
        neighbors: [null, null, null, null],
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

    node.neighbors[ports[0].portNumber - 1] = nodeToConnect;
    nodeToConnect.neighbors[ports[1].portNumber - 1] = node;

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
        node.neighbors.forEach(function (neighbor) {
            if (neighbor !== null) {
                findNodesConnectedToNode(neighbor);
            }
        });
    };

    findNodesConnectedToNode(rootNode);

    return nodesConnectedToRoot;
};

var nullConnectionsToRemovedNodes = function () {
    Object.values(nodes).forEach(function (node) {
        node.neighbors.forEach(function (neighbor, i) {
            if (neighbor === null) {
                return;
            }
            var isRemoved = nodes[neighbor.id] !== undefined;
            if (!isRemoved) {
                node.neighbors[i] = null;
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
    node.neighbors.forEach(function (neighbor, i) {
        if (neighbor !== null &&
            neighbor.id === nodeToDisconnect.id) {
            node.neighbors[i] = null;
        }
    });
};

var disconnect = function (port) {
    var nodeId = port.nodeId;

    if (!nodeExists(nodeId)) {
        return;
    }

    var node = nodes[nodeId];
    var neighbor = node.neighbors[port.portNumber - 1];

    node.neighbors[port.portNumber - 1] = null;
    disconnectNode(neighbor, node);
};

var sortNodes = function () {
    sortedNodes.length = 0;
    var sortedNodeIds = Object.keys(nodes).sort();
    sortedNodeIds.forEach(function (nodeId) {
        sortedNodes.push(nodes[nodeId]);
    });
};

var findEdges = function () {
    var processedNodes = [];

    edges.length = 0;

    Object.values(nodes).forEach(function (node) {
        Object.values(node.neighbors).forEach(function (neighbor) {
            if (neighbor === null) {
                return;
            }
            var connectionAlreadyFound =
                    processedNodes.indexOf(neighbor) !== -1;
            if (connectionAlreadyFound) {
                return;
            }
            edges.push({
                node: node,
                neighbor: neighbor
            });
        });
        processedNodes.push(node);
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
    findEdges();
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
