/*jslint browser: true, maxlen: 80 */

/*global THREE*/

// See article "Generating uniformly distributed numbers on a sphere":
// http://corysimon.github.io/articles/uniformdistn-on-sphere/
var randomUnitVector = function () {
    var theta = 2 * Math.PI * Math.random();
    var phi = Math.acos(1 - 2 * Math.random());

    return new THREE.Vector3(
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

var distance = function (v1, v2) {
    return v2.clone().sub(v1).length();
};

var normalizeOrRandomize = function (v) {
    if (v.length() === 0) {
        v = vector.randomUnitVector();
    } else {
        v.normalize();
    }
};

var normalizedConnection = function (v1, v2) {
    var v = v2.clone().sub(v1);
    normalizeOrRandomize(v);
    return v;
};

export default {
    rotateToTetrahedralAngle: rotateToTetrahedralAngle,
    randomUnitVector: randomUnitVector,
    normalizeOrRandomize: normalizeOrRandomize,
    distance: distance,
    normalizedConnection: normalizedConnection
};
