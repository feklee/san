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

var normalizedDeviation = function (nodes, targetDistance) {
    return Math.abs(distance(nodes) - targetDistance) / targetDistance;
};

var addEdgeLengthDeviations = function (deviations) {
    edges.forEach(function (edge) {
        deviations.push(
            normalizedDeviation([edge.node, edge.connectedNode], 1));
    });
};

var addDistanceDevsOfNeighborsOfNode = function (deviations, node) {
    var neighbors = node.connectedNodes;
    neighbors.forEach(function (neighbor, i) {
        if (neighbor === null) {
            return;
        }
        var otherNeighbor;
        var normalizedDistance;
        var j = i + 1;
        while (j < 4) {
            otherNeighbor = neighbors[j];
            if (otherNeighbor !== null) {
                deviations.push(normalizedDeviation([neighbor, otherNeighbor],
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

var totalDeviation = function () {
    return findDeviations().reduce((sum, x) => sum + x, 0);
};

var fitness = function (individual) {
    Object.values(nodes).forEach(function (node, i) {
        node.location.x = individual[i * 3] / resolution;
        node.location.y = individual[i * 3 + 1] / resolution;
        node.location.z = individual[i * 3 + 2] / resolution;
    });

    return 1 / totalDeviation();

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

    let algorithm = JSGA({
        length: dimensionality * numberOfNodes,
        radix: numberOfNodes * resolution,
        fitness: fitness,
        size: 100,
        children: 4,
        mutationRate: 0.05,
        crossovers: 1
    });

    for (let generation of algorithm.run(50)) {
/*        console.log(`Generation ${generation.generation}`);
        console.log(`Array of individuals: ${generation.population}`);
        console.log(`Best individual: ${generation.best.params}`);
        console.log(`Best individual's fitness: ${generation.best.fitness}`);*/
    }

    console.log(findDeviations());

    moveCenterToOrigin();

    console.log(nodes);
};
