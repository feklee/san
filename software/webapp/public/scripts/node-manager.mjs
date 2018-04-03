/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import visualize from "./visualize.mjs";
import nodes from "./nodes.mjs";
import edges from "./edges.mjs";
import sortedNodes from "./sorted-nodes.mjs";
import settings from "./settings.mjs";
import renderMatrix from "./render-matrix.mjs";
import optimizeLocations from "./optimize-locations.mjs";
import vector from "./vector.mjs";
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
        connectedPorts: [],
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

var locationAtRandomOrientation = function (origin) {
    return origin.clone().add(vector.randomUnitVector());
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

var updateConnectedPorts = function (node) {
    node.connectedPorts = [];
    node.neighbors.forEach(function (neighbor, i) {
        if (neighbor !== null) {
            node.connectedPorts.push({
                node: node,
                portNumber: i + 1,
                neighbor: neighbor
            });
        }
    });
};

var setNeighbor = function (node, portNumber, neighbor) {
    node.neighbors[portNumber - 1] = neighbor;
    updateConnectedPorts(node);
};

var connect = function (ports) {
    if (!nodeExists(ports[0].nodeId) || !nodeExists(ports[1].nodeId)) {
        return;
    }

    var node = nodes[ports[0].nodeId];
    var nodeToConnect = nodes[ports[1].nodeId];

    setNeighbor(node, ports[0].portNumber, nodeToConnect);
    setNeighbor(nodeToConnect, ports[1].portNumber, node);

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

    var node = nodes[port.nodeId];
    node.neighbors[port.portNumber - 1] = null;
    updateConnectedPorts(node);
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
renderMatrix();
visualize();

export default {
    addNode: addNode,
    updateConnection: updateConnection
};
