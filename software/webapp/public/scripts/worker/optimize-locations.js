/*jslint browser: true, maxlen: 80 */

/*global JSGA, THREE, self, settings, vector*/

self.importScripts("/bower_components/jsga/jsga.js");
try {
    eval("self.importScripts(\"../settings.mjs\")");
} catch(ignore) {
}

/*try {
    self.importScripts("../vector.mjs");
} catch(ignore) {
}*/

var resolution = settings.optimizationResolution;

var updateExpectedNeighborLocation = function (port) {
    port.expectedNeighborLocation =
        port.node.location.clone().add(port.expectedConnection);
};

var setExpectedNeighborLocation1 = function (port) {
    port.expectedConnection = vector.normalizedConnection(
        port.node.location,
        port.neighbor.location
    );
    updateExpectedNeighborLocation(port);
};

var setExpectedNeighborLocation2 = function (port2) {
    var node = port2.node;
    var port1 = node.connectedPorts[0];

    var a = port1.expectedConnection;
    var b = vector.normalizedConnection(node.location,
                                         port2.neighbor.location);
    vector.normalizeOrRandomize(b);
    vector.rotateToTetrahedralAngle(a, b);

    port2.expectedConnection = b;

    updateExpectedNeighborLocation(port2);
};

var setExpectedNeighborLocation3 = function (port3) {
    var node = port3.node;
    var port1 = node.connectedPorts[0];
    var port2 = node.connectedPorts[1];

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
    var port1 = node.connectedPorts[0];
    var port2 = node.connectedPorts[1];

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
        port.neighbor.location.distanceTo(port.expectedNeighborLocation)
    );
};

var addDeviationsForNode = function (deviations, node) {
    node.connectedPorts.forEach(function (port, i) {
        setExpectedNeighborLocation(port, i);
        addDeviation(deviations, port);
    });
};

var findDeviations = function (sortedNodes) {
    var deviations = [];
    sortedNodes.forEach(function (node) {
        addDeviationsForNode(deviations, node);
    });
    return deviations;
};

var largestDeviation = function (sortedNodes) {
    return Math.max.apply(null, findDeviations(sortedNodes));
};

var assignLocationsToNodes = function (sortedNodes, individual) {
    sortedNodes.forEach(function (node, i) {
        node.location.x = individual[i * 3] / resolution;
        node.location.y = individual[i * 3 + 1] / resolution;
        node.location.z = individual[i * 3 + 2] / resolution;
    });
};

var fitness = function (sortedNodes, individual) {
    assignLocationsToNodes(sortedNodes, individual);
    return 1 / largestDeviation(sortedNodes);
};

var findCenter = function (sortedNodes) {
    var center = new THREE.Vector3();

    sortedNodes.forEach(function (node) {
        center.add(node.location);
    });

    center.divideScalar(sortedNodes.length);

    return center;
};

var moveCenterToOrigin = function (sortedNodes) {
    var center = findCenter(sortedNodes);

    sortedNodes.forEach(function (node) {
        node.location.sub(center);
    });
};

var optimizeNodeDistribution = function (sortedNodes) {
    var numberOfNodes = sortedNodes.length;
    var nothingToBeDone = numberOfNodes === 1;
    if (nothingToBeDone) {
        return;
    }

    var dimensionality = 3;
    var jsga = JSGA;
    var algorithm = jsga({
        length: dimensionality * numberOfNodes,
        radix: numberOfNodes * resolution,
        fitness: function () {
            fitness(sortedNodes, fitness);
        },
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

    assignLocationsToNodes(sortedNodes, generation.best.params);
};

self.optimizeLocations = function (sortedNodes) {
    "use strict";
//    optimizeNodeDistribution(sortedNodes);
//    moveCenterToOrigin(sortedNodes);
//    console.log(findDeviations(sortedNodes));
    console.log(sortedNodes);
    return {
        "*": new THREE.Vector3(0, 0, 0),
        "A": new THREE.Vector3(1, 0, 0)
    };
};
