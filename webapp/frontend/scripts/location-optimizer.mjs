// Optimizes the locations of nodes using a genetic algorithm. After
// optimization, ideally all neighboring nodes have a distance of 1,
// and the angles between the connecting vectors match those on the
// spheres.

/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import visibleNodes from "./visible-nodes.mjs";
import settings from "./settings.mjs";
import vector from "./vector.mjs";
import jsga from "jsga-feklee";

var coordinatesFromRhino = [ // TODO: remove
    -0.5, -0.688190960235587, -1.11351636441161,
    0.5, -0.688190960235587, -1.11351636441161,
    0.809016994374947, 0.262865556059567, -1.11351636441161,
    0, 0.85065080835204, -1.11351636441161,
    -0.809016994374947, 0.262865556059567, -1.11351636441161,
    -0.809016994374947, -1.11351636441161, -0.262865556059567,
    0, -1.37638192047117, 0.262865556059567,
    0.809016994374948, -1.11351636441161, -0.262865556059567,
    1.30901699437495, -0.42532540417602, 0.262865556059567,
    1.30901699437495, 0.42532540417602, -0.262865556059567,
    0.809016994374948, 1.11351636441161, 0.262865556059567,
    0, 1.37638192047117, -0.262865556059567,
    -0.809016994374947, 1.11351636441161, 0.262865556059567,
    -1.30901699437495, 0.42532540417602, -0.262865556059567,
    -1.30901699437495, -0.42532540417602, 0.262865556059567,
    5.55111512312578E-16, -0.850650808352039, 1.11351636441161,
    0.809016994374947, -0.262865556059567, 1.11351636441161,
    0.5, 0.688190960235587, 1.11351636441161,
    -0.5, 0.688190960235587, 1.11351636441161,
    -0.809016994374947, -0.262865556059567, 1.11351636441161
];

var loSettings = settings.locationOptimizer;

var updateExpectedNeighborLocation = function (connection) {
    connection.expectedNeighborLocation =
        connection.fromPort.node.testLocation.clone().add(
            connection.expectedVector
        );
};

var setExpectedNeighborLocation1 = function (connection) {
    connection.expectedVector = vector.normalizedConnectingVector(
        connection.fromPort.node.testLocation,
        connection.toPort.node.testLocation
    );
    updateExpectedNeighborLocation(connection);
};

var setExpectedNeighborLocation2 = function (connection2) {
    var node = connection2.fromPort.node;
    var connection1 = node.visibleConnections[0];

    var a = connection1.expectedVector;
    var b = vector.normalizedConnectingVector(
        node.testLocation,
        connection2.toPort.node.testLocation
    );
    vector.normalizeOrRandomize(b);
    vector.rotateToTetrahedralAngle(a, b);

    connection2.expectedVector = b;

    updateExpectedNeighborLocation(connection2);
};

var setExpectedNeighborLocation3 = function (connection3) {
    var node = connection3.fromPort.node;
    var connection1 = node.visibleConnections[0];
    var connection2 = node.visibleConnections[1];

    var a = connection1.expectedVector;
    var b = connection2.expectedVector;
    var cw = b.clone().applyAxisAngle(a, vector.tetrahedralAngle);
    var ccw = b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    switch (connection1.fromPort.portNumber) {
    case 1:
        switch (connection2.fromPort.portNumber) {
        case 2:
            switch (connection3.fromPort.portNumber) {
            case 3:
                connection3.expectedVector = cw;
                break;
            case 4:
                connection3.expectedVector = ccw;
                break;
            }
            break;
        case 3:
            connection3.expectedVector = cw;
            break;
        }
        break;
    case 2:
        connection3.expectedVector = ccw;
        break;
    }

    updateExpectedNeighborLocation(connection3);
};

var setExpectedNeighborLocation4 = function (connection4) {
    var node = connection4.fromPort.node;
    var connection1 = node.visibleConnections[0];
    var connection2 = node.visibleConnections[1];

    var a = connection1.expectedVector;
    var b = connection2.expectedVector;

    connection4.expectedVector =
        b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    updateExpectedNeighborLocation(connection4);
};

var setExpectedNeighborLocation = function (connection, i) {
    switch (i) {
    case 0:
        setExpectedNeighborLocation1(connection);
        break;
    case 1:
        setExpectedNeighborLocation2(connection);
        break;
    case 2:
        setExpectedNeighborLocation3(connection);
        break;
    case 3:
        setExpectedNeighborLocation4(connection);
        break;
    }
};

var addDeviation = function (deviations, connection) {
    deviations.push(
        connection.toPort.node.testLocation.distanceToSquared(
            connection.expectedNeighborLocation
        )
    );
};

var addDeviationsForNode = function (deviations, node) {
    node.visibleConnections.forEach(function (connection, i) {
        setExpectedNeighborLocation(connection, i);
        addDeviation(deviations, connection);
    });
};

var findDeviations = function () {
    var deviations = [];
    visibleNodes.forEach(function (node) {
        addDeviationsForNode(deviations, node);
    });
    return deviations;
};

var largestDeviation = function () {
    return Math.max.apply(null, findDeviations());
};

var sumOfDeviations = function () { // TODO: maybe remove
    return findDeviations().reduce((a, b) => a + b, 0);
};

var assignLocationsToNodes = function (locationType, individual) {
    visibleNodes.forEach(function (node, i) {
        if (node[locationType] === undefined) {
            node[locationType] = new THREE.Vector3();
        }
        var location = node[locationType];
        location.x = individual[i * 3] / loSettings.resolution;
        location.y = individual[i * 3 + 1] / loSettings.resolution;
        location.z = individual[i * 3 + 2] / loSettings.resolution;
    });
};

var fitness = function (individual) {
    assignLocationsToNodes("testLocation", individual);
// TODO:    return 10000 - largestDeviation();
// TODO:    return 1 / largestDeviation();
    return 10000 - sumOfDeviations();
// TODO:        return 1 / sumOfDeviations();
};

var findCenter = function () {
    var center = new THREE.Vector3();

    visibleNodes.forEach(function (node) {
        center.add(node.location);
    });

    center.divideScalar(visibleNodes.length);

    return center;
};

var moveCenterToOrigin = function () {
    var center = findCenter();

    visibleNodes.forEach(function (node) {
        node.location.sub(center);
    });
};

var iterator;

var createSeedFromNodeLocations = function (size) {
    var individual = [];

    visibleNodes.forEach(function (node, i) {
        var location = node.location;
/* TODO        individual[i * 3] = coordinatesFromRhino[i * 3] * loSettings.resolution;
        individual[i * 3 + 1] = coordinatesFromRhino[i * 3 + 1] *
            loSettings.resolution;
        individual[i * 3 + 2] = coordinatesFromRhino[i * 3 + 2] *
            loSettings.resolution; */
        individual[i * 3] =
            Math.round(location.x * loSettings.resolution);
        individual[i * 3 + 1] =
            Math.round(location.y * loSettings.resolution);
        individual[i * 3 + 2] =
            Math.round(location.z * loSettings.resolution);
    });

    var seedSize = Math.round(loSettings.seedSizePercentage / 100 *
                              size);
    var a = Array;
    return a(seedSize).fill(individual);
};

var update = function () {
    var numberOfVisibleNodes = visibleNodes.length;
    var nothingToBeDone = numberOfVisibleNodes <= 1;
    if (nothingToBeDone) {
        return;
    }

    var size = loSettings.populationSizeFactor * numberOfVisibleNodes;
    var length = (3 * // number of coordinates per nodes
                  numberOfVisibleNodes);
    var algorithm = jsga({
        length: length,
        radix: /* TODO numberOfVisibleNodes*/ 3 * // size of the space
            loSettings.resolution,
        fitness: fitness,
        size: size,
        seed: createSeedFromNodeLocations(size),
//        children: 2, // TODO: make configurable
        mutationRate: loSettings.mutationRate,
        crossovers: loSettings.crossovers
    });

 // TODO: maybe make mutation rate dependent on population size - "see As far as I know, the variables are strongly related with the size of the problem. As Bas Van der Geer said, for small problams is even better to use exhaustive search through the whole set of solutions. I'm still researching the NSGA-II algorithm, but with Genetic Algorithm I use a population N at least bigger than the number of variables and a mutation rate of about 1/N. The experiments we did with crossover showed that a rate of 80% is good enough." - https://www.researchgate.net/post/How_to_select_parameterspopulation_generations_mutation_crossover_rate_in_NSGA_II

    var iterable = algorithm.run(-1);
    iterator = iterable[Symbol.iterator]();
};

// TODO, just for debugging
var deviation = function (population) {
    var fitnessList = [];
    population.forEach(function (individual) {
        fitnessList.push(fitness(individual));
    });
    var mean = fitnessList.reduce((a, b) => a + b, 0) / fitnessList.length;
    var sigma = 0; // standard deviation
    fitnessList.forEach(function (x) {
        var delta = x - mean;
        sigma += delta * delta;
    });
    sigma /= fitnessList.length;
    sigma = Math.sqrt(sigma);
    return [mean, sigma];
};

var startTime;

var updateNodeLocations = function (generation) {
    var now = Date.now();
    if (startTime === undefined) {
        startTime = now;
    }
    var elapsedTime = now - startTime;
    if (elapsedTime > 10000) {
        startTime = now;
        console.log(
            elapsedTime,
            generation.generation, fitness(generation.best.params),
            deviation(generation.population)
        );
    }
    assignLocationsToNodes("location", generation.best.params);
    moveCenterToOrigin();
};

var run = function () {
    var item;
    var iterate;
    iterate = function () {
        if (iterator === undefined) {
            setTimeout(iterate, 0);
            return;
        }
        item = iterator.next();
        var generation = item.value;
        updateNodeLocations(generation);
        setTimeout(iterate, 0);
    };
    iterate();
};

run();

export default {
    update: update
};
