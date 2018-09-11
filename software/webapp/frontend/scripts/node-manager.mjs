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
    return port.node.connections.find(function (connection) {
        return connection.portNumber === port.portNumber;
    });
};

var removeConnectionOnPort = function (port) {
    var connection = connectionOnPort(port);
    if (connection === undefined) {
        return;
    }
    port.node.connections.splice(connection.index);
};

var disconnectOnBothSides = function (port) {
    var connection = connectionOnPort(port);
    if (connection === undefined) {
        return;
    }
    var neighborPort = {
        node: connection.neighbor,
        portNumber: connection.neighborPortNumber
    };
    removeConnectionOnPort(port);
    removeConnectionOnPort(neighborPort);
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

    disconnectOnBothSides(port);

    newConnection.index = port.node.connections.length;
    port.node.connections.push(newConnection);
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
        node.connections.forEach(function (connection) {
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
        Object.values(node.connections).forEach(function (port) {
            if (connectionIsExpired(port)) {
                disconnectOnBothSides(port);
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

var nodeExists = function (id) {
    return nodes[id] !== undefined;
};

var addNode = function (id) {
    if (nodeExists(id)) {
        return;
    }
    var node = {
        id: id,
        connections: [],
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
