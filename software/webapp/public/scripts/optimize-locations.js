/*jslint browser: true, maxlen: 80 */

/*global JSGA*/

import nodes from "./nodes.js";
import settings from "./settings.js";

var resolution = settings.optimizationResolution;

var lengthOfEdge = function (pairOfNodes) {
    var locations = [pairOfNodes[0].location, pairOfNodes[1].location];
    var edge = location[1] - location[0];
    return edge.length();
};

var lengthsOfEdges = function () {
    var lengths = [];

    Object.values(nodes).forEach(function (node) {
        Object.values(node.connectedNodes).forEach(function (connectedNode) {
            lengths.push(lengthOfEdge());
        });
    });

    individual.forEach(function (value) {
        
    });
            return individual.reduce((p, c) => p + c); // the fitness is the sum of all the values
        }
    ...
};

var lengthOfLongestEdge = function () {
    return Math.max.apply(null, lengthsOfEdges());
};

var fitness = function (individual) {
    Object.values(nodes).forEach(function (node, i) {
        nodes.location.x = individual[i * 3] / resolution;
        nodes.location.y = individual[i * 3 + 1] / resolution;
        nodes.location.z = individual[i * 3 + 2] / resolution;
    });

    return lengthOfLongestEdge();
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
        console.log(`Generation ${generation.generation}`);
        console.log(`Array of individuals: ${generation.population}`);
        console.log(`Best individual: ${generation.best.params}`);
        console.log(`Best individual's fitness: ${generation.best.fitness}`);
    }
};
