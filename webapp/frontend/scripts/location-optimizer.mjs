// Optimizes the locations of nodes using a genetic algorithm. After
// optimization, ideally all neighboring nodes have a distance of 1, and the
// angles between the connecting vectors match those on the spheres.

/*jslint browser: true, maxlen: 80 */

import visibleNodes from "./visible-nodes.mjs";
import nodes from "./nodes.mjs";
import settings from "./settings.mjs";
import fitness from "./fitness.mjs";
// TODO: import fitness from "./alternative-fitness.mjs";
import vector from "./vector.mjs";
import {
    Vector3
} from "../../node_modules/three/build/three.module.js";
import jsga from "jsga-feklee";
import jspowell from "jspowell";

var loSettings = settings.locationOptimizer;

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

var axisOfNodeWithNoVisibleNeighbor =
    function (
        nodeLocation,
        tiltAngle // rad
    ) {
        // just one of inifinitely many possibilities:
        return vector.zAxis.clone().applyAxisAngle(vector.yAxis, tiltAngle);
    };

var portIsOnBottomHemisphere = function (port) {
    return port.portNumber > 2;
};

var portIsOnTopHemisphere = function (port) {
    return !portIsOnBottomHemisphere(port);
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
var stopHasBeenRequested;

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

var fitnessOfIndividual = function (individual) {
    assignLocationsToNodes("testLocation", individual);
    return fitness();
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
        fitness: fitnessOfIndividual,
        size: loSettings.populationSize,
        seed: createSeedFromNodeLocations(loSettings.seedSize),
        mutationRate: loSettings.mutationRate,
        crossovers: loSettings.crossovers
    });

/*    var algorithm = jspowell({
        length: length,
        radix: loSettings.sideLength * loSettings.resolution,
        fitness: fitnessOfIndividual
    });*/

    var iterable = algorithm.run(-1);
    iterator = iterable[Symbol.iterator]();
};

var deviation = function (population) {
    var fitnessList = [];
    population.forEach(function (individual) {
        fitnessList.push(fitnessOfIndividual(individual));
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
            fitnessOfIndividual(generation.best.params)
            //deviation(generation.population)
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
    stopHasBeenRequested = false;
    iterate = function () {
        if (stopHasBeenRequested) {
            return;
        }
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

var stop = function () {
    stopHasBeenRequested = true;
};

var setLocations = function (locations) {
    Object.keys(locations).forEach(function (nodeId) {
        var location = locations[nodeId];
        var node = nodes[nodeId];
        if (node !== undefined) {
            node.location.set(location[0], location[1], location[2]);
        }
    });
};

run();

export default {
    update: update
};

var exportsForDebugging = {
    update: update,
    run: run,
    stop: stop,
    setLocations: setLocations
};

window.locationOptimizer = exportsForDebugging;
