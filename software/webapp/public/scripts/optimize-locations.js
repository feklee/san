/*jslint browser: true, maxlen: 80 */

/*global JSGA, THREE*/

import nodes from "./nodes.js";
import sortedNodes from "./sorted-nodes.js";
import settings from "./settings.js";
import findEdges from "./find-edges.js";

var resolution = settings.optimizationResolution;

var lengthOfEdge = function (edge) {
    var connection =
        edge.node.location.clone().sub(edge.connectedNode.location);
    return connection.length();
};

var largestDeviationOfEdgeLength = function () {
    var edges = findEdges(); // todo: do that only once, or cache
    var lengths = [];
    var largestDeviation = 0;

    edges.forEach(function (edge) {
        var deviation = Math.abs(1 - lengthOfEdge(edge));
        if (deviation > largestDeviation) {
            largestDeviation = deviation;
        }
    });

    return largestDeviation;
};

var fitness = function (individual) {
    Object.values(nodes).forEach(function (node, i) {
        node.location.x = individual[i * 3] / resolution;
        node.location.y = individual[i * 3 + 1] / resolution;
        node.location.z = individual[i * 3 + 2] / resolution;
    });

    return 1 / largestDeviationOfEdgeLength();
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
    moveCenterToOrigin();

    return;

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
        console.log(`Generation ${generation.generation}`);
        console.log(`Array of individuals: ${generation.population}`);
        console.log(`Best individual: ${generation.best.params}`);
        console.log(`Best individual's fitness: ${generation.best.fitness}`);
    }

    console.log(nodes);
};
