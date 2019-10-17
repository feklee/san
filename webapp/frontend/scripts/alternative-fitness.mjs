// Experimental fitness based on the sum of independent terms, see:
//
// https://feklee.github.io/san/notes/145c7131-6c7f-49cb-8ecc-07658b5c4a96

/*jslint browser: true, maxlen: 80 */

import edges from "./edges.mjs";
import visibleNodes from "./visible-nodes.mjs";

var connectingVector = function (node1, node2) {
    return node2.testLocation.clone().sub(node1.testLocation);
};

var squaredAngleDeviationForPair = function (connection1, connection2) {
    if (!connection1.fromPort.node.isVisible ||
            !connection1.toPort.node.isVisible ||
            !connection2.fromPort.node.isVisible ||
            !connection2.toPort.node.isVisible) {
        return 0;
    }
    var vector1 = connectingVector(
        connection1.fromPort.node,
        connection1.toPort.node
    );
    var vector2 = connectingVector(
        connection2.fromPort.node,
        connection2.toPort.node
    );
    var expectedDotProduct = -1 / 3;
    return vector1.dot(vector2) - expectedDotProduct;
};

var squaredAngleDeviationsForNode = function (node) {
    var connections = node.connections;
    var sum = 0;
    Object.keys(connections).forEach(function (i) {
        var connection1 = connections[i];
        Object.keys(connections).forEach(function (j) {
            var connection2 = connections[j];
            if (connection1 !== connection2) {
                sum += squaredAngleDeviationForPair(connection1, connection2);
            }
        });
    });
    return sum;
};

var sumOfSquaredAngleDeviations = function () {
    var sum = 0;
    visibleNodes.forEach(function (node) {
        sum += squaredAngleDeviationsForNode(node);
    });
    return sum;
};

var squaredDistanceDeviation = function (edge) {
    var expectedSquaredDistance = 1;
    var nodes = [...edge.nodes];
    var squareDistance =
            nodes[0].testLocation.distanceToSquared(nodes[1].testLocation);
    return Math.pow(squareDistance - expectedSquaredDistance, 2);
};

var sumOfSquaredDistanceDeviations = function () {
    var sum = 0;
    edges.forEach(function (edge) {
        sum += squaredDistanceDeviation(edge);
    });
    return sum;
};

var sumOfDeviations = function () {
    return sumOfSquaredDistanceDeviations() + sumOfSquaredAngleDeviations();
};

var fitness = function () {
    return -sumOfDeviations();
};

export default fitness;
