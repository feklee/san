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

var connectionOnPort = function (port) {
    return port.node.connectedPorts.find(function (connection) {
        return connection.portNumber === port.portNumber;
    });
};

var setNeighbor = function (port, neighborPort) {
    var newConnection = {
        nodeId: port.node.id,
        node: port.node, // TODO: maybe store port here, also for neighbor
        portNumber: port.portNumber,
        neighbor: neighborPort.node,
        neighborPortNumber: neighborPort.portNumber,
        connectionExpiryTime: expiryTime()
    };

    // TODO: better remove existing connection, because also on the
    // other side it needs to be removed, which is complex

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

var removeConnectionOnPort = function (port) {
    var connection = connectionOnPort(port);
    port.node.connectedPorts.splice(port.index);
};

var disconnect = function (port) {
    var neighborPort = {
        node: port.neighbor,
        portNumber: port.neighborPortNumber
    };
    removeConnectionOnPort(port);
    removeConnectionOnPort(neighborPort);
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

var connectionExists = function (pair) {
    var connection = connectionOnPort(pair.parentPort);
    if (!connection) {
        return false;
    }

    return connection.neighbor === pair.childPort.node;
};

var refreshConnection = function (pair) {
    Object.values(pair).forEach(function (port) {
        var connection = connectionOnPort(port);
        if (connection) {
            connection.connectionExpiryTime = expiryTime();
        }
    });
};

var updateConnections = function () {
    removeExpiredConnections();
    removeNodesNotConnectedToRoot();
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

var connect = function (pair) {
    setNeighbor(pair.parentPort, pair.childPort);
    setNeighbor(pair.childPort, pair.parentPort);

    if (pair.childPort.node.location === null) {
        setChildLocation(pair.parentPort.node, pair.childPort.node);
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
