/*jslint browser: true, maxlen: 80 */

/*global JSGA, THREE*/

import nodes from "./nodes.mjs";
import sortedNodes from "./sorted-nodes.mjs";
import settings from "./settings.mjs";
import vector from "./vector.mjs";

var resolution = settings.optimizationResolution;

var updateExpectedNeighborLocation = function (port) {
    port.expectedNeighborLocation =
        port.node.location.clone().add(port.expectedConnection);
};

var setExpectedNeighborLocation1 = function (port) {
    port.expectedConnection = vector.normalizedConnection(
        port.node.location,
        port.neighbor.location
    );
    updateExpectedNeighborLocation(port);
};

var setExpectedNeighborLocation2 = function (port2) {
    var node = port2.node;
    var port1 = node.connectedPorts[0];

    var v1 = port1.expectedConnection;
    var v2 = vector.normalizedConnection(node.location,
                                         port2.neighbor.location);
    vector.normalizeOrRandomize(v2);
    vector.rotateToTetrahedralAngle(v1, v2);

    port2.expectedConnection = v2;

    updateExpectedNeighborLocation(port2);
};

var setExpectedNeighborLocation34 = function (port34) {
    var node = port34.node;
    var port1 = node.connectedPorts[0];
    var port2 = node.connectedPorts[1];

    var axis = port1.expectedConnection;
    var v = port2.expectedConnection;

    // todo: compare port numbers, then rotate around v2 around v1 in the right
    // direction
};

var setExpectedNeighborLocation = function (port, i) {
    switch (i) {
    case 0:
        setExpectedNeighborLocation1(port);
        break;
    case 1:
        setExpectedNeighborLocation2(port);
        break;
    default:
        setExpectedNeighborLocation34(port);
    }
};

var addDeviation = function (deviations, port) {
    deviations.push(vector.distance(port.neighbor.location,
                                    port.expectedNeighborLocation));
};

var addDeviationsForNode = function (deviations, node) {
    node.connectedPorts.forEach(function (port, i) {
        setExpectedNeighborLocation(port, i);
        addDeviation(deviations, port);
    });
};

var findDeviations = function () {
    var deviations = [];
    sortedNodes.forEach(function (node) {
        addDeviationsForNode(deviations, node);
    });
    return deviations;
};

var largestDeviation = function () {
    return Math.max.apply(null, findDeviations());
};

var assignLocationsToNodes = function (individual) {
    Object.values(nodes).forEach(function (node, i) {
        node.location.x = individual[i * 3] / resolution;
        node.location.y = individual[i * 3 + 1] / resolution;
        node.location.z = individual[i * 3 + 2] / resolution;
    });
};

var fitness = function (individual) {
    assignLocationsToNodes(individual);
    return 1 / largestDeviation();
};

var findCenter = function () {
    var center = new THREE.Vector3();

    sortedNodes.forEach(function (node) {
        center.add(node.location);
    });

    center.divideScalar(sortedNodes.length);

    return center;
};

var moveCenterToOrigin = function () {
    var center = findCenter();

    sortedNodes.forEach(function (node) {
        node.location.sub(center);
    });
};

var optimizeNodeDistribution = function () {
    var numberOfNodes = Object.keys(nodes).length;
    var nothingToBeDone = numberOfNodes === 1;
    if (nothingToBeDone) {
        return;
    }

    var dimensionality = 3;
    var jsga = JSGA;
    var algorithm = jsga({
        length: dimensionality * numberOfNodes,
        radix: numberOfNodes * resolution,
        fitness: fitness,
        size: 20 * numberOfNodes, // needs to be even
        children: numberOfNodes,
        mutationRate: 0.05,
        crossovers: 1
    });

    var generation;
    var iterable = algorithm.run(10 * numberOfNodes);
    var iterator = iterable[Symbol.iterator]();
    var n = iterator.next();
    while (!n.done) {
        generation = n.value;
        n = iterator.next();
    }

    

    assignLocationsToNodes(generation.best.params);
};

export default function () {
    optimizeNodeDistribution();
    moveCenterToOrigin();
    console.log(findDeviations());
    console.log(nodes);
};
