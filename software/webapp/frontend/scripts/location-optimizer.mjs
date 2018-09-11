// Optimizes the locations of nodes using a genetic algorithm.

/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import sortedNodes from "./sorted-nodes.mjs";
import settings from "./settings.mjs";
import vector from "./vector.mjs";
import jsga from "jsga-feklee";

var loSettings = settings.locationOptimizer;

var updateExpectedNeighborLocation = function (port) { // TODO: port means sth. different here than elsewhere!
    port.expectedNeighborLocation =
        port.node.testLocation.clone().add(port.expectedConnection);
};

var setExpectedNeighborLocation1 = function (port) {
    port.expectedConnection = vector.normalizedConnection(
        port.node.testLocation,
        port.neighbor.testLocation
    );
    updateExpectedNeighborLocation(port);
};

var setExpectedNeighborLocation2 = function (port2) {
    var node = port2.node;
    var port1 = node.connections[0];

    var a = port1.expectedConnection;
    var b = vector.normalizedConnection(node.testLocation,
                                        port2.neighbor.testLocation);
    vector.normalizeOrRandomize(b);
    vector.rotateToTetrahedralAngle(a, b);

    port2.expectedConnection = b;

    updateExpectedNeighborLocation(port2);
};

var setExpectedNeighborLocation3 = function (port3) {
    var node = port3.node;
    var port1 = node.connections[0];
    var port2 = node.connections[1];

    var a = port1.expectedConnection;
    var b = port2.expectedConnection;
    var cw = b.clone().applyAxisAngle(a, vector.tetrahedralAngle);
    var ccw = b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    switch (port1.portNumber) {
    case 1:
        switch (port2.portNumber) {
        case 2:
            switch (port3.portNumber) {
            case 3:
                port3.expectedConnection = cw;
                break;
            case 4:
                port3.expectedConnection = ccw;
                break;
            }
            break;
        case 3:
            port3.expectedConnection = cw;
            break;
        }
        break;
    case 2:
        port3.expectedConnection = ccw;
        break;
    }

    updateExpectedNeighborLocation(port3);
};

var setExpectedNeighborLocation4 = function (port4) {
    var node = port4.node;
    var port1 = node.connections[0];
    var port2 = node.connections[1];

    var a = port1.expectedConnection;
    var b = port2.expectedConnection;

    port4.expectedConnection =
        b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    updateExpectedNeighborLocation(port4);
};

var setExpectedNeighborLocation = function (port, i) {
    switch (i) {
    case 0:
        setExpectedNeighborLocation1(port);
        break;
    case 1:
        setExpectedNeighborLocation2(port);
        break;
    case 2:
        setExpectedNeighborLocation3(port);
        break;
    case 3:
        setExpectedNeighborLocation4(port);
        break;
    }
};

var addDeviation = function (deviations, port) {
    deviations.push(
        port.neighbor.testLocation.distanceTo(
            port.expectedNeighborLocation
        )
    );
};

var addDeviationsForNode = function (deviations, node) {
    Object.values(node.connections).forEach(function (port, i) {
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

var assignLocationsToNodes = function (locationType, individual) {
    sortedNodes.forEach(function (node, i) {
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

var iterator;

var createSeedFromNodeLocations = function (size) {
    var individual = [];

    sortedNodes.forEach(function (node, i) {
        var location = node.location;
        individual[i * 3] = location.x * loSettings.resolution;
        individual[i * 3 + 1] = location.y * loSettings.resolution;
        individual[i * 3 + 2] = location.z * loSettings.resolution;
    });

    var seedSize = Math.round(loSettings.seedSizePercentage / 100 * size);
    var a = Array;
    return a(seedSize).fill(individual);
};

var update = function () {
    var numberOfNodes = sortedNodes.length;
    var nothingToBeDone = numberOfNodes === 1;
    if (nothingToBeDone) {
        return;
    }

    var size = loSettings.populationSizeFactor * numberOfNodes;
    var dimensionality = 3;
    var algorithm = jsga({
        length: dimensionality * numberOfNodes,
        radix: numberOfNodes * loSettings.resolution,
        fitness: fitness,
        size: size,
        seed: createSeedFromNodeLocations(size),
        children: numberOfNodes,
        mutationRate: loSettings.mutationRate,
        crossovers: loSettings.crossovers
    });

    var iterable = algorithm.run(-1);
    iterator = iterable[Symbol.iterator]();
};

var updateNodeLocations = function (generation) {
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
