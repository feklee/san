// Manages the collection of nodes and the connections in between
// them.

/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import updateEdges from "./update-edges.mjs";
import sortedNodes from "./sorted-nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";
import renderMatrix from "./render-matrix.mjs";
import locationOptimizer from "./location-optimizer.mjs";
import vector from "./vector.mjs";
import visualization from "./visualization.mjs";
import settings from "./settings.mjs";
import {Vector3} from
        "../../node_modules/three/build/three.module.js";
import {
    graphUpdateInterval, // ms
    connectionExpiryDuration, // ms
    nodeColorsList
} from "./shared-settings.mjs";

var rootNode;

var expiryTime = function () { // ms
    return Date.now() + connectionExpiryDuration;
};

var locationAtRandomOrientation = function (origin) {
    return origin.clone().add(vector.randomUnitVector());
};

var setChildLocation = function (parentNode, childNode) {
    childNode.location = parentNode.isVisible
        ? locationAtRandomOrientation(parentNode.location)
        : new Vector3(0, 0, 0);
};

var connectionOnPort = function (port) {
    return port.node.connections[port.portNumber];
};

var sortConnections = function (node) {
    node.sortedConnections.length = 0;
    node.visibleConnections.length = 0;
    var sortedPortNumbers = Object.keys(node.connections).sort();
    sortedPortNumbers.forEach(function (portNumber) {
        var connection = node.connections[portNumber];
        node.sortedConnections.push(connection);
        if (connection.isVisible) {
            node.visibleConnections.push(connection);
        }
    });
};

var removeConnectionOnPort = function (port) {
    delete port.node.connections[port.portNumber];
    sortConnections(port.node);
};

var sortNodes = function () {
    sortedNodes.length = 0;
    visibleNodes.length = 0;
    var sortedNodeIds = Object.keys(nodes).sort();
    sortedNodeIds.forEach(function (nodeId) {
        var node = nodes[nodeId];
        sortedNodes.push(node);
        if (node.isVisible) {
            visibleNodes.push(node);
        }
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
        expiryTime: expiryTime(),
        isVisible: port.node.isVisible && neighborPort.node.isVisible
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
    var connectionsWereRemoved = false;

    Object.values(nodes).forEach(function (node) {
        Object.values(node.connections).forEach(
            function (connection) {
                if (connectionIsExpired(connection)) {
                    removeConnection(connection);
                    connectionsWereRemoved = true;
                }
            }
        );
    });

    if (connectionsWereRemoved) {
        removeNodesNotConnectedToRoot();
        updateForVisualization();
    }
};

var resetExpiryTime = function (connection) {
    connection.expiryTime = expiryTime();
};

var refreshConnection = function (pair) {
    Object.values(pair).forEach(function (port) {
        var connection = connectionOnPort(port);
        if (connection) {
            resetExpiryTime(connection);
        }
    });
};

var connectionExists = function (pair) {
    var connection = connectionOnPort(pair.parentPort);
    if (!connection) {
        return false;
    }

    return connection.toPort.node === pair.childPort.node;
};

var nodeExists = function (id) {
    return nodes[id] !== undefined;
};

var nodeIsRootNode = function (id) {
    return id === "*";
};

var nodeColorsListIndexFromId = function (id) {
    return nodeIsRootNode(id)
        ? 0
        : id.charCodeAt(0) - 0x40;
};

var addNode = function (id) {
    if (nodeExists(id)) {
        return;
    }
    var index = nodeColorsListIndexFromId(id);
    var colors = nodeColorsList[index] ||
            [settings.defaultNodeColor, settings.defaultNodeColor];
    var node = {
        id: id,
        isVisible: id !== "*",
        connections: {},
        sortedConnections: [],
        visibleConnections: [],
        location: null,
        colors: colors
    };

    nodes[id] = node;

    if (node.isVisible) {
        visualization.createNodeObject3D(node);
    }

    sortNodes();

    return node;
};

var addRootNode = function () {
    rootNode = addNode("*");
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
updateForVisualization();
setInterval(removeExpiredConnections, graphUpdateInterval);

export default {
    addNode: addNode,
    connectionExists: connectionExists,
    refreshConnection: refreshConnection,
    connect: connect
};
