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

// TODO: take the following values from common configuration
const updateInterval = 150; // ms
const expiryDuration = 2.5 * updateInterval; // ms

var nodeExists = function (id) { // TODO: really needed to check with ID?
    return nodes[id] !== undefined;
};

var expiryTime = function () { // ms
    return Date.now() + expiryDuration;
};

var locationAtRandomOrientation = function (origin) {
    return origin.clone().add(vector.randomUnitVector());
};

var setChildLocation = function (parentNode, childNode) {
    childNode.location =
        locationAtRandomOrientation(parentNode.location);
};

var updateConnectedPorts = function (node) {
    node.connectedPorts = [];
    var index = 0;
    node.neighbors.forEach(function (neighbor, i) {
        if (neighbor !== null) {
            node.connectedPorts.push({
                nodeId: node.id,
                node: node,
                portNumber: i + 1,
                neighbor: neighbor,
                connectionExpiryTime: expiryTime(),
                index: index
            });
            index += 1;
        }
    });
};

var connectionOnPort = function (port) {
    return port.node.connectedPorts.find(function (connection) {
        return connection.portNumber === port.portNumber;
    });
};

var setNeighbor = function (port, neighborPort) {
    port.node.neighbors[port.portNumber - 1] = neighborPort.node;

    var newConnection = {
        nodeId: port.node.id,
        node: port.node, // TODO: maybe store port here, also for neighbor
        portNumber: port.portNumber,
        neighbor: neighborPort.node,
        neighborPortNumber: neighborPort.portNumber,
        connectionExpiryTime: expiryTime()
    };

    var existingConnection = connectionOnPort(port);
    var replaceExistingConnection = existingConnection !== undefined;
    if (replaceExistingConnection) {
        newConnection.index = existingConnection.index;
        port.node.connectedPorts[existingConnection.index] =
            newConnection;
    } else {
        newConnection.index = port.node.connectedPorts.length;
        port.node.connectedPorts.push(newConnection);
    }
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
        node.connectedPorts.forEach(function (connection) {
            findNodesConnectedToNode(connection.neighbor);
        });
    };

    findNodesConnectedToNode(rootNode);

    return nodesConnectedToRoot;
};

var nullRemovedNeighbors = function () {
    Object.values(nodes).forEach(function (node) {
        node.neighbors.forEach(function (neighbor, i) {
            if (neighbor === null) {
                return;
            }
            var neighborIsRemoved = nodes[neighbor.id] === undefined;
            if (neighborIsRemoved) {
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

var removeNeighbor = function (port) {
    // TODO: implement
};

var disconnect = function (port) {
    var nodeId = port.nodeId; // TODO: -> port.node

    if (!nodeExists(nodeId)) {
        return;
    }

    var node = nodes[nodeId];
    var neighbor = node.neighbors[port.portNumber - 1];
    var portIsAlreadyDisconnected = neighbor === null;
    if (portIsAlreadyDisconnected) {
        return;
    }
    node.neighbors[port.portNumber - 1] = null;
    removeNeighbor(port);

    nullConnectionsToNeighbor(neighbor, node);
// TODO:    removeNeighbor(neighborPort);
};

var sortNodes = function () {
    sortedNodes.length = 0;
    var sortedNodeIds = Object.keys(nodes).sort();
    sortedNodeIds.forEach(function (nodeId) {
        sortedNodes.push(nodes[nodeId]);
    });
};

var connectionIsExpired = function (port) {
    return Date.now() > port.connectionExpiryTime;
};

var removeExpiredConnections = function () {
    Object.values(nodes).forEach(function (node) {
        Object.values(node.connectedPorts).forEach(function (port) {
            if (connectionIsExpired(port)) {
                disconnect(port);
            }
        });
    });
};

var connectionExists = function (portsPair) {
    var connection = connectionOnPort(portsPair[0]);
    if (!connection) {
        return false;
    }

    return connection.neighbor === portsPair[1].node;
};

var refreshConnection = function (portsPair) {
    portsPair.forEach(function (port) {
        var connection = connectionOnPort(port);
        if (connection) {
            connection.connectionExpiryTime = expiryTime();
        }
    });
};

var updateConnections = function () {
    removeExpiredConnections();
    removeNodesNotConnectedToRoot();
    nullRemovedNeighbors();
    sortNodes();
    updateEdges();
    renderMatrix();
    locationOptimizer.update();
};

var addNode = function (id) {
    if (nodeExists(id)) {
        return;
    }
    var node = {
        id: id,
        neighbors: [null, null, null, null],
        connectedPorts: [], // TODO: -> connections?
        location: null
    };

    nodes[id] = node;

    visualization.createNodeObject3D(node);

    return node;
};

var addRootNode = function () {
    rootNode = addNode("*");
    rootNode.location = new Vector3(0, 0, 0);
};

var connect = function (portsPair) {
    var parentPort = portsPair[0];
    var childPort = portsPair[1];

    setNeighbor(parentPort, childPort);
    setNeighbor(childPort, parentPort);

    if (childPort.node.location === null) {
        setChildLocation(parentPort.node, childPort.node);
    }
    updateConnections();
};

addRootNode();
setInterval(updateConnections, updateInterval);

export default {
    addNode: addNode,
    connectionExists: connectionExists,
    refreshConnection: refreshConnection,
    connect: connect
};
