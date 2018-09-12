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
import {
    graphUpdateInterval, // ms
    connectionExpiryDuration // ms
} from "./common-settings.mjs";
var rootNode;

var expiryTime = function () { // ms
    return Date.now() + connectionExpiryDuration;
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

var removeConnection = function (connection) {
    removeConnectionOnPort(connection.fromPort);
    removeConnectionOnPort(connection.toPort);
};

var disconnectOnBothSides = function (port) {
    var connection = connectionOnPort(port);
    if (connection === undefined) {
        return;
    }
    removeConnection(connection);
};

var setNeighbor = function (port, neighborPort) {
    var newConnection = {
        fromPort: port,
        toPort: neighborPort,
        expiryTime: expiryTime()
    };

    port.node.connections[port.portNumber] = newConnection;
    sortConnections(port.node);
};

var connectionIsExpired = function (connection) {
    return Date.now() > connection.expiryTime;
};

var updateForVisualization = function () {
    updateEdges();
    renderMatrix();
    locationOptimizer.update();
};

var removeExpiredConnections = function () {
    Object.values(nodes).forEach(function (node) {
        Object.values(node.connections).forEach(
            function (connection) {
                if (connectionIsExpired(connection)) {
                    removeConnection(connection);
                }
            }
        );
    });

    removeNodesNotConnectedToRoot();
    updateForVisualization();
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
            connection.expiryTime = expiryTime();
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
    // First, remove any existing connections:
    disconnectOnBothSides(pair.parentPort);
    disconnectOnBothSides(pair.childPort);

    setNeighbor(pair.parentPort, pair.childPort);
    setNeighbor(pair.childPort, pair.parentPort);

    if (pair.childPort.node.location === null) {
        setChildLocation(pair.parentPort.node, pair.childPort.node);
    }

    removeNodesNotConnectedToRoot();
    updateForVisualization();
};

addRootNode();
setInterval(removeExpiredConnections, graphUpdateInterval);

export default {
    addNode: addNode,
    connectionExists: connectionExists,
    refreshConnection: refreshConnection,
    connect: connect
};
