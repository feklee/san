// Optimizes the locations of nodes using a genetic algorithm. After
// optimization, ideally all neighboring nodes have a distance of 1,
// and the angles between the connecting vectors match those on the
// spheres.

/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import sortedNodes from "./sorted-nodes.mjs";
import settings from "./settings.mjs";
import vector from "./vector.mjs";
import jsga from "jsga-feklee";

var loSettings = settings.locationOptimizer;

var updateExpectedNeighborLocation = function (connection) {
    connection.expectedNeighborLocation =
        connection.node.testLocation.clone().add(
            connection.expectedVector
        );
};

var setExpectedNeighborLocation1 = function (connection) {
    connection.expectedVector = vector.normalizedConnectingVector(
        connection.node.testLocation,
        connection.neighbor.testLocation
    );
    updateExpectedNeighborLocation(connection);
};

var setExpectedNeighborLocation2 = function (connection2) {
    var node = connection2.node;
    var connection1 = node.sortedConnections[0];

    var a = connection1.expectedVector;
    var b = vector.normalizedConnectingVector(
        node.testLocation,
        connection2.neighbor.testLocation
    );
    vector.normalizeOrRandomize(b);
    vector.rotateToTetrahedralAngle(a, b);

    connection2.expectedVector = b;

    updateExpectedNeighborLocation(connection2);
};

var setExpectedNeighborLocation3 = function (connection3) {
    var node = connection3.node;
    var connection1 = node.sortedConnections[0];
    var connection2 = node.sortedConnections[1];

    var a = connection1.expectedVector;
    var b = connection2.expectedVector;
    var cw = b.clone().applyAxisAngle(a, vector.tetrahedralAngle);
    var ccw = b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    switch (connection1.portNumber) {
    case 1:
        switch (connection2.portNumber) {
        case 2:
            switch (connection3.portNumber) {
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
    var node = connection4.node;
    var connection1 = node.sortedConnections[0];
    var connection2 = node.sortedConnections[1];

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
        connection.neighbor.testLocation.distanceTo(
            connection.expectedNeighborLocation
        )
    );
};

var addDeviationsForNode = function (deviations, node) {
    node.sortedConnections.forEach(function (connection, i) {
        setExpectedNeighborLocation(connection, i);
        addDeviation(deviations, connection);
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

    var seedSize = Math.round(loSettings.seedSizePercentage / 100 *
                              size);
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
