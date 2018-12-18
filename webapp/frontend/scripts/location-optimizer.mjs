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

var portIsOnBottomHemisphere = function (port) {
    return port.portNumber > 2;
};

var portIsOnTopHemisphere = function (port) {
    return !portIsOnBottomHemisphere(port);
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

var axisOfNodeWithOneVisibleNeighbor = function (node) {
    var possibleNodeAxes = axesOfNodeWithOneVisibleNeighbor(
        node.tiltAngle,
        node.visibleConnections[0].vector
    );
    return possibleNodeAxes[0]; // any axis is OK => simply pick the 1st one, if
                                // there is more than one axis
};

var possibleVectorTo2ndNeighbor = function (node, vectorTo1stNeighbor, axis) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];
    const port1 = connection1.fromPort;
    const port2 = connection2.fromPort;

    var portsAreOnSameHemisphere =
        (portIsOnTopHemisphere(port1) && portIsOnTopHemisphere(port2)) ||
        (portIsOnBottomHemisphere(port1) && portIsOnBottomHemisphere(port2));

    var v = vectorTo1stNeighbor.clone();

    if (portsAreOnSameHemisphere) {
        return v.applyAxisAngle(axis, Math.PI);
    }

    const portNumber1 = port1.portNumber;
    const portNumber2 = port2.portNumber;

    if ((portNumber1 === 1 && portNumber2 === 4) ||
        (portNumber1 === 2 && portNumber2 === 3) ||
        (portNumber1 === 3 && portNumber2 === 1) ||
        (portNumber1 === 4 && portNumber2 === 2)) {
        return v.reflect(axis).applyAxisAngle(axis, Math.PI / 2);
    }

    return v.reflect(axis).applyAxisAngle(axis, -Math.PI / 2);
};

var possibleVectorsTo2ndNeighbor = function (
    node, vectorTo1stNeighbor, possibleNodeAxes
) {
    return possibleNodeAxes.map(
        (axis) => possibleVectorTo2ndNeighbor(node, vectorTo1stNeighbor, axis)
    );
};

var possible2ndNeighborLocations = function (
    node, nodeLocation, vectorTo1stNeighbor, possibleNodeAxes
) {
    const possibleVectors = possibleVectorsTo2ndNeighbor(
        node, vectorTo1stNeighbor, possibleNodeAxes
    );
    return possibleVectors.map(function (vector) {
        return nodeLocation.clone().add(vector);
    });
};

var axisOfNodeWithTwoVisibleNeighbors = function (node) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];
    var vectorTo1stNeighbor = connection1.vector;
    var neighbor2 = connection2.toPort;
    var locationOf2ndNeighbor = neighbor2.node.location;
    var possibleNodeAxes = axesOfNodeWithOneVisibleNeighbor(
        node.tiltAngle,
        vectorTo1stNeighbor
    );
    var possibleLocations = possible2ndNeighborLocations(
        node, node.location, vectorTo1stNeighbor, possibleNodeAxes
    );
    var i = vector.indexOfClosestPoint(
        locationOf2ndNeighbor, possibleLocations
    );
    return possibleNodeAxes[i];
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
var setExpectedNeighbor1LocationTA = function (node) {
    const connection1 = node.visibleConnections[0];
    const neighbor = connection1.toPort.node;
    var angle = node.tiltAngle;
    if (portIsOnBottomHemisphere(connection1.fromPort)) {
        angle += Math.PI;
    }
    var angleRange = vector.tiltAnglePlusHalfTetAngle(angle);

    connection1.expectedNeighborLocation = vector.closestPointOnUnitSphere({
        center: node.testLocation,
        fromPoint: neighbor.testLocation,
        minAngleToVerticalAxis: angleRange[0],
        maxAngleToVerticalAxis: angleRange[1]
    });
    setExpectedVector(connection1);
};

// 2nd neighbor
//
// This function is for a node where the tilt angle is known.
//
// The tilt angle and the position of the first neighbor allow up to two
// possible locations for the second neighbor.
var setExpectedNeighbor2LocationTA = function (node) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];
    const neighbor2 = connection2.toPort.node;

    var vectorTo1stNeighbor = connection1.expectedVector;
    var possibleNodeAxes = axesOfNodeWithOneVisibleNeighbor(
        node.tiltAngle,
        vectorTo1stNeighbor
    );
    const possibleLocations = possible2ndNeighborLocations(
        node, node.testLocation, vectorTo1stNeighbor, possibleNodeAxes
    );

    connection2.expectedNeighborLocation = vector.closestPoint(
        neighbor2.testLocation, possibleLocations
    );

    setExpectedVector(connection2);
};

// 1st neighbor: The only constraint is the distance of 1 to the node.
var setExpectedNeighbor1Location = function (node) {
    const connection1 = node.visibleConnections[0];
    connection1.expectedVector = vector.normalizedConnectingVector(
        connection1.fromPort.node.testLocation,
        connection1.toPort.node.testLocation
    );
    updateExpectedNeighborLocation(connection1);
};

// 2nd neighbor: This neighbor must be at distance 1 to the node and oriented at
// tetrahedral angle to the first neighbor.
var setExpectedNeighbor2Location = function (node) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];

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
var setExpectedNeighbor3Location = function (node) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];
    const connection3 = node.visibleConnections[2];

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
var setExpectedNeighbor4Location = function (node) {
    const connection1 = node.visibleConnections[0];
    const connection2 = node.visibleConnections[1];
    const connection4 = node.visibleConnections[3];

    var a = connection1.expectedVector;
    var b = connection2.expectedVector;

    connection4.expectedVector =
        b.clone().applyAxisAngle(a, -vector.tetrahedralAngle);

    updateExpectedNeighborLocation(connection4);
};

var setExpectedNeighborLocation = function (node, i) {
    switch (i) {
    case 0:
        setExpectedNeighbor1Location(node);
        break;
    case 1:
        setExpectedNeighbor2Location(node);
        break;
    case 2:
        setExpectedNeighbor3Location(node);
        break;
    case 3:
        setExpectedNeighbor4Location(node);
        break;
    }
};

var setExpectedNeighborLocationTA = function (node, i) {
    switch (i) {
    case 0:
        setExpectedNeighbor1LocationTA(node);
        break;
    case 1:
        setExpectedNeighbor2LocationTA(node);
        break;
    case 2:
        setExpectedNeighbor3LocationTA(node);
        break;
    case 3:
        setExpectedNeighbor4LocationTA(node);
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
            setExpectedNeighborLocationTA(node, i);
        } else {
            setExpectedNeighborLocation(node, i);
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
        node.axis = axisOfNodeWithOneVisibleNeighbor(node);
    }
    if (numberOfVisibleNeighbors === 2) {
        node.axis = axisOfNodeWithTwoVisibleNeighbors(node);
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
