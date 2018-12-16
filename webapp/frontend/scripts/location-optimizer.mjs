// Optimizes the locations of nodes using a genetic algorithm. After
// optimization, ideally all neighboring nodes have a distance of 1, and the
// angles between the connecting vectors match those on the spheres.

/*jslint browser: true, maxlen: 80 */

import visibleNodes from "./visible-nodes.mjs";
import settings from "./settings.mjs";
import vector from "./vector.mjs";
import {
    Vector3
} from "../../node_modules/three/build/three.module.js";
import jsga from "jsga-feklee";

var loSettings = settings.locationOptimizer;

// TODO: is that consistent with instructions for building nodes? Create graphic with port labels and labels of hemispheres
var portIsOnUpperHemisphere = function (port) {
    return port.portNumber > 2;
};

var updateExpectedNeighborLocation = function (connection) {
    connection.expectedNeighborLocation =
        connection.fromPort.node.testLocation.clone().add(
            connection.expectedVector
        );
};

var setExpectedVector = function (connection) {
    connection.expectedVector =
        connection.expectedNeighborLocation.clone().sub(
            connection.fromPort.node.testLocation
        );
};

var axisOfNodeWithNoVisibleNeighbor =
    function (
        nodeLocation,
        tiltAngle // rad
    ) {
        // just one of inifinitely many possibilities:
        return vector.zAxis.clone().applyAxisAngle(vector.yAxis, tiltAngle);
    };

// Calculates the possible node axes that satisfy:
//
//   * node tilt angle
//
//   * neighbor location
var axesOfNodeWithOneVisibleNeighbor = function (
    tiltAngle, // rad
    vectorToNeighbor
) {
    var intersections = vector.intVerticalConeWTetrahedralCone(
        2 * tiltAngle,
        vectorToNeighbor
    );
    return intersections;
};

var axisOfNodeWithTwoVisibleNeighbors = function (
    tiltAngle, // rad
    vectorToNeighbor1,
    vectorToNeighbor2
) {
    var possibleAxes =
        axesOfNodeWithOneVisibleNeighbor(tiltAngle, vectorToNeighbor1);
    return possibleAxes[0]; // TODO: select the one that matches the neighbors most closely
};

// 1st neighbor
//
// This function is for a node where the tilt angle is known.
//
// Constraints for the neighbor of this node are:
//
//   * a distance of 1, and
//
//   * the angle of the connection between the node and the neighbor, measured
//     relative to the vertical axis. This angle depends 1. on the tilt angle of
//     the node, and 2. on the position of the port to which the neighbor is
//     connected.
var setExpectedNeighborLocation1TA = function (connection1) {
    const thisNode = connection1.fromPort.node;
    const neighbor = connection1.toPort.node;
    var angle = thisNode.tiltAngle;
    if (portIsOnUpperHemisphere(connection1.fromPort)) {
        angle += Math.PI;
    }
    var angleRange = vector.tiltAnglePlusHalfTetAngle(angle);

    connection1.expectedNeighborLocation = vector.closestPointOnUnitSphere({
        center: thisNode.testLocation,
        fromPoint: neighbor.testLocation,
        minAngleToVerticalAxis: angleRange[0],
        maxAngleToVerticalAxis: angleRange[1]
    });
    setExpectedVector(connection1);
};

var possibleVectorsToNeighbor2TA = function (node, connection1, connection2) {
    var vectorToNeighbor1 = connection1.expectedVector;

    var possibleNodeAxes = axesOfNodeWithOneVisibleNeighbor(
        node.tiltAngle,
        vectorToNeighbor1
    );
    var portsAreOnSameHemisphere =
        (portIsOnUpperHemisphere(connection1.fromPort) &&
         portIsOnUpperHemisphere(connection2.fromPort)) ||
        (!portIsOnUpperHemisphere(connection1.fromPort) &&
         !portIsOnUpperHemisphere(connection2.fromPort));

    return possibleNodeAxes.map(function (axis) {
        if (portsAreOnSameHemisphere) {
            return vectorToNeighbor1.clone().applyAxisAngle(axis, Math.PI);
        }
        // TODO: take care of other situations
    });
};

var possibleNeighbor2LocationsTA = function (node, connection1, connection2) {
    const possibleVectors = possibleVectorsToNeighbor2TA(
        node, connection1, connection2
    );
    return possibleVectors.map(function (vector) {
        return node.testLocation.clone().add(vector);
    });
};

// 2nd neighbor
//
// This function is for a node where the tilt angle is known.
//
// The tilt angle and the position of the first neighbor allow up to two
// possible locations for the second neighbor.
var setExpectedNeighborLocation2TA = function (connection2) {
    const node = connection2.fromPort.node;
    const connection1 = node.visibleConnections[0];
    const neighbor2 = connection2.toPort.node;

    const possibleLocations = possibleNeighbor2LocationsTA(
        node, connection1, connection2
    );

    // TODO: location sometimes wrong

    connection2.expectedNeighborLocation = vector.closestPoint(
        neighbor2.testLocation, possibleLocations
    );

    setExpectedVector(connection2);
};

// 1st neighbor: The only constraint is the distance of 1 to the node.
var setExpectedNeighborLocation1 = function (connection1) {
    connection1.expectedVector = vector.normalizedConnectingVector(
        connection1.fromPort.node.testLocation,
        connection1.toPort.node.testLocation
    );
    updateExpectedNeighborLocation(connection1);
};

// 2nd neighbor: This neighbor must be at distance 1 to the node and oriented at
// tetrahedral angle to the first neighbor.
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

// 3nd neighbor: The required position can be calculated exactly based on the
// expected positions of the first two neighbors and the position of the node.
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

// 4th neighbor: The required position can be calculated exactly.
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

var setExpectedNeighborLocationTA = function (connection, i) {
    switch (i) {
    case 0:
        setExpectedNeighborLocation1TA(connection);
        break;
    case 1:
        setExpectedNeighborLocation2TA(connection);
        break;
    case 2:
        setExpectedNeighborLocation3TA(connection);
        break;
    case 3:
        setExpectedNeighborLocation4TA(connection);
        break;
    }
};

var addDeviation = function (deviations, connection) {
    var deviation =
        connection.toPort.node.testLocation.distanceToSquared(
            connection.expectedNeighborLocation
        );

    deviations.push(deviation);
};

var addDeviationsForNode = function (deviations, node) {
    node.visibleConnections.forEach(function (connection, i) {
        var nodeHasTiltAngle = node.tiltAngle !== null;
        if (nodeHasTiltAngle) {
            setExpectedNeighborLocationTA(connection, i);
        } else {
            setExpectedNeighborLocation(connection, i);
        }
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

var sumOfDeviations = function () {
    return findDeviations().reduce((a, b) => a + b, 0);
};

var coordinateFromIndividual = function (individual, nodeIndex,
                                         coordinateIndex) {
    return individual[nodeIndex * 3 + coordinateIndex] / loSettings.resolution;
};

var coordinateToIndividual = function (individual, nodeIndex,
                                       coordinateIndex,
                                       coordinate) {
    individual[nodeIndex * 3 + coordinateIndex] =
        Math.round(coordinate * loSettings.resolution);
};

var assignLocationsToNodes = function (locationType, individual) {
    visibleNodes.forEach(function (node, i) {
        if (node[locationType] === undefined) {
            node[locationType] = new Vector3();
        }
        var location = node[locationType];
        location.x = coordinateFromIndividual(individual, i, 0);
        location.y = coordinateFromIndividual(individual, i, 1);
        location.z = coordinateFromIndividual(individual, i, 2);
    });
};

var updateConnectionVectors = function () {
    visibleNodes.forEach(function (node) {
        node.visibleConnections.forEach(function (connection) {
            connection.vector =
                connection.toPort.node.location.clone().sub(
                    connection.fromPort.node.location
                );
        });
    });
};

var updateNodeAxis = function (node) {
    var nodeHasTiltAngle = node.tiltAngle !== null;
    if (!nodeHasTiltAngle) {
        return;
    }

    var numberOfVisibleNeighbors = node.visibleConnections.length;
    if (numberOfVisibleNeighbors === 0) {
        node.axis = axisOfNodeWithNoVisibleNeighbor(
            node.location,
            node.tiltAngle
        );
    }
    if (numberOfVisibleNeighbors === 1) {
        var possibleAxes = axesOfNodeWithOneVisibleNeighbor(
            node.tiltAngle,
            node.visibleConnections[0].vector
        );
        node.axis = possibleAxes[0];
    }
    if (numberOfVisibleNeighbors === 2) {
        node.axis = axisOfNodeWithTwoVisibleNeighbors(
            node.tiltAngle,
            node.visibleConnections[0].vector
        );
    }
};

var updateNodeAxes = function () {
    visibleNodes.forEach(updateNodeAxis);
};

var fitness = function (individual) {
    assignLocationsToNodes("testLocation", individual);
    return -sumOfDeviations();
};

var findCenter = function () {
    var center = new Vector3();

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

var createSeedFromNodeLocations = function (seedSize) {
    var individual = [];

    visibleNodes.forEach(function (node, i) {
        var location = node.location;
        coordinateToIndividual(individual, i, 0, location.x);
        coordinateToIndividual(individual, i, 1, location.y);
        coordinateToIndividual(individual, i, 2, location.z);
    });

    var a = Array;
    return a(seedSize).fill(individual);
};

var update = function () {
    var numberOfVisibleNodes = visibleNodes.length;
    var noNodesToPlaceAndOrient = numberOfVisibleNodes === 0;
    if (noNodesToPlaceAndOrient) {
        return;
    }

    var length = (3 * // number of coordinates per 3D point
                  numberOfVisibleNodes);
    var algorithm = jsga({
        length: length,
        radix: loSettings.sideLength * loSettings.resolution,
        fitness: fitness,
        size: loSettings.populationSize,
        seed: createSeedFromNodeLocations(loSettings.seedSize),
        mutationRate: loSettings.mutationRate,
        crossovers: loSettings.crossovers
    });
    var iterable = algorithm.run(-1);
    iterator = iterable[Symbol.iterator]();
};

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
            generation.generation,
            fitness(generation.best.params),
            deviation(generation.population)
        );
    }
    assignLocationsToNodes("location", generation.best.params);
    moveCenterToOrigin();
    updateConnectionVectors();
    updateNodeAxes();
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
