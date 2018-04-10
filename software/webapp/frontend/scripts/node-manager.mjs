/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import updateEdges from "./update-edges.mjs";
import sortedNodes from "./sorted-nodes.mjs";
import renderMatrix from "./render-matrix.mjs";
import locationOptimizer from "./location-optimizer.mjs";
import vector from "./vector.mjs";
import visualization from "./visualization.mjs";
import {Vector3} from "../../node_modules/three/build/three.module.js";
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
        location: null
    };

    nodes[id] = node;

    visualization.createNodeObject3D(node);

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
            visualization.destroyNodeObject3D(node);
            delete nodes[node.id];
        }
    });
};

var nullConnectionsToNeighbor = function (node, neighbor) {
    node.neighbors.forEach(function (neighborToTest, i) {
        if (neighborToTest === neighbor) {
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
    var neighbor = node.neighbors[port.portNumber - 1];
    var alreadyDisconnected = neighbor === null;
    if (alreadyDisconnected) {
        return;
    }
    node.neighbors[port.portNumber - 1] = null;
    updateConnectedPorts(node);

    nullConnectionsToNeighbor(neighbor, node);
    updateConnectedPorts(neighbor);
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
    updateEdges();
    renderMatrix();
    locationOptimizer.update();
};

var addRootNode = function () {
    rootNode = addNode("*");
    rootNode.location = new Vector3(0, 0, 0);
};

addRootNode();
sortNodes();
renderMatrix();

export default {
    addNode: addNode,
    updateConnection: updateConnection
};
