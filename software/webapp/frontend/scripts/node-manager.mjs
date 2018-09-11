// Manages the collection of nodes and the connections in between
// them.

/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import updateEdges from "./update-edges.mjs";
import sortedNodes from "./sorted-nodes.mjs";
import renderMatrix from "./render-matrix.mjs";
import locationOptimizer from "./location-optimizer.mjs";
import vector from "./vector.mjs";
import visualization from "./visualization.mjs";
import {Vector3} from
"../../node_modules/three/build/three.module.js";
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
    return port.node.connections[port.portNumber];
};

var sortConnections = function (node) {
    node.sortedConnections.length = 0;
    var sortedPortNumbers = Object.keys(node.connections).sort();
    sortedPortNumbers.forEach(function (portNumber) {
        node.sortedConnections.push(node.connections[portNumber]);
    });
};

var removeConnectionOnPort = function (port) {
    delete port.node.connections[port.portNumber];
    sortConnections(port.node);
};

var sortNodes = function () {
    sortedNodes.length = 0;
    var sortedNodeIds = Object.keys(nodes).sort();
    sortedNodeIds.forEach(function (nodeId) {
        sortedNodes.push(nodes[nodeId]);
    });
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
        Object.values(node.connections).forEach(
            function (connection) {
                findNodesConnectedToNode(connection.toPort.node);
            }
        );
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

    sortNodes();
};

var disconnectOnBothSides = function (port) {
    var connection = connectionOnPort(port);
    if (connection === undefined) {
        return;
    }
    var neighborPort = connection.toPort;
    removeConnectionOnPort(port);
    removeConnectionOnPort(neighborPort);

    removeNodesNotConnectedToRoot();
};

var setNeighbor = function (port, neighborPort) {
    var newConnection = {
        fromPort: port,
        toPort: neighborPort,
        connectionExpiryTime: expiryTime()
    };

    disconnectOnBothSides(port); // if a connection already exists
    port.node.connections[port.portNumber] = newConnection;
    sortConnections(port.node);
};

var connectionIsExpired = function (port) {
    return Date.now() > port.connectionExpiryTime;
};

var processConnections = function () {
    updateEdges();
    renderMatrix();
    locationOptimizer.update();
};

var removeExpiredConnections = function () {
    Object.values(nodes).forEach(function (node) {
        Object.values(node.connections).forEach(function (port) {
            if (connectionIsExpired(port)) {
                disconnectOnBothSides(port);
            }
        });
    });

    processConnections();
};

var connectionExists = function (pair) {
    var connection = connectionOnPort(pair.parentPort);
    if (!connection) {
        return false;
    }

    return connection.toPort.node === pair.childPort.node;
};

var refreshConnection = function (pair) {
    Object.values(pair).forEach(function (port) {
        var connection = connectionOnPort(port);
        if (connection) {
            connection.connectionExpiryTime = expiryTime();
        }
    });
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
        connections: {},
        sortedConnections: [],
        location: null
    };

    nodes[id] = node;

    visualization.createNodeObject3D(node);

    sortNodes();

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

    processConnections();
};

addRootNode();
setInterval(removeExpiredConnections, updateInterval);

export default {
    addNode: addNode,
    connectionExists: connectionExists,
    refreshConnection: refreshConnection,
    connect: connect
};
