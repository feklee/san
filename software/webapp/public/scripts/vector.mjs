/*jslint node: true, browser: true, maxlen: 80 */

/*global THREE, global*/

var windowType = typeof "window";
var runningInNode = windowType === "undefined";
if (runningInNode) {
    THREE = global.THREE;
}

// See article "Generating uniformly distributed numbers on a sphere":
// http://corysimon.github.io/articles/uniformdistn-on-sphere/
var randomUnitVector = function () {
    var theta = 2 * Math.PI * Math.random();
    var phi = Math.acos(1 - 2 * Math.random());

    return new (THREE).Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
    );
};

var rotateToTetrahedralAngle = function (vUnitFixed, vUnit) {
    var enclosingAngle = 0; // todo: calculate
    var tetrahedralAngle = Math.acos(-1 / 3) / 2;

    var axis = vFixed.clone().cross(v);
    if (axis.length() === 0) {
        // fixme
    }

    v1.clone().applyAxisAngle(axis, angle); // todo: rotation in right direction?
};

var normalizeOrRandomize = function (a) {
    if (a.length() === 0) {
        a.fromArray(randomUnitVector().toArray());
    } else {
        a.normalize();
    }
};

var normalizedConnection = function (a, b) {
    var c = b.clone().sub(a);
    normalizeOrRandomize(c);
    return c;
};

var areEqual = function (a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = Number.EPSILON;
    }
    return Math.max(
        Math.abs(b.x - a.x),
        Math.abs(b.y - a.y),
        Math.abs(b.z - a.z)
    ) < epsilon;
};

export default {
    rotateToTetrahedralAngle: rotateToTetrahedralAngle,
    randomUnitVector: randomUnitVector,
    normalizeOrRandomize: normalizeOrRandomize,
    normalizedConnection: normalizedConnection,
    areEqual: areEqual
};
