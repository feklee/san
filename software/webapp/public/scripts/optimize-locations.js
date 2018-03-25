/*jslint browser: true, maxlen: 80 */

/*global JSGA, THREE*/

import nodes from "./nodes.js";
import edges from "./edges.js";
import sortedNodes from "./sorted-nodes.js";
import settings from "./settings.js";

var resolution = settings.optimizationResolution;
const targetNeighborDistance = 2 * Math.sqrt(2 / 3);

var distance = function (nodes) {
    var connection = nodes[1].location.clone().sub(nodes[0].location);
    return connection.length();
};

var deviation = function (nodes, targetDistance) {
    return Math.abs(distance(nodes) - targetDistance);
};

var addEdgeLengthDeviations = function (deviations) {
    edges.forEach(function (edge) {
        deviations.push(
            deviation([edge.node, edge.neighbor], 1));
    });
};

var addDistanceDevsOfNeighborsOfNode = function (deviations, node) {
    var neighbors = node.neighbors;
    neighbors.forEach(function (neighbor, i) {
        if (neighbor === null) {
            return;
        }
        var otherNeighbor;
        var j = i + 1;
        while (j < 4) {
            otherNeighbor = neighbors[j];
            if (otherNeighbor !== null) {
                deviations.push(deviation([neighbor, otherNeighbor],
                                          targetNeighborDistance));
            }
            j += 1;
        }
    });
};

var addNeighborDistanceDeviations = function (deviations) {
    sortedNodes.forEach(function (node) {
        addDistanceDevsOfNeighborsOfNode(deviations, node);
    });
};

var findDeviations = function () {
    var deviations = [];
    addEdgeLengthDeviations(deviations);
    addNeighborDistanceDeviations(deviations);
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

export default function () {
    var numberOfNodes = Object.keys(nodes).length;
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
    moveCenterToOrigin();
    console.log(findDeviations());
    console.log(nodes);
};
