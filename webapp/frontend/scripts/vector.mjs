/*jslint node: true, browser: true, maxlen: 80 */

/*global THREE, global*/

var windowType = typeof "window";
var runningInNode = windowType === "undefined";
if (runningInNode) {
    THREE = global.THREE;
}

const tetrahedralAngle = Math.acos(-1 / 3);

var angleToZAxis = function (vector) {
    var zAxisVector = new THREE.Vector3(0, 0, 1);
    if (vector.length() < Number.EPSILON) {
        return 0;
    }
    return vector.angleTo(zAxisVector);
};

// Returns the angle range that results from the sum of two vectors, *v* and
// *w*:
//
//   * *v*: tilted by `tiltAngle` relative to the z axis
//
//   * *w*: at half tetrahedral angle (ca. 55 deg) relative to *v*
//
// The result is a range since it is not known in which direction *v* and *w*
// are pointing.
var tiltAnglePlusHalfTetAngle = function ( // [min, max]
    tiltAngle // deg
) {
    var hta = tetrahedralAngle / 2;
    return [Math.max(0, tiltAngle - hta), Math.min(Math.PI, tiltAngle + hta)];
};

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

var rotateToTetrahedralAngle = function (fixedUnitVector,
                                         unitVector) {
    var rotationAxis = fixedUnitVector.clone().cross(unitVector);
    var v;
    while (rotationAxis.length() < Number.EPSILON) {
        v = randomUnitVector();
        rotationAxis = fixedUnitVector.clone().cross(v);
    }
    rotationAxis.normalize();

    unitVector.fromArray(fixedUnitVector.toArray());

    unitVector.applyAxisAngle(rotationAxis, tetrahedralAngle);
};

var rotateToAngleToZAxis = function (
    unitVector, // vector that gets rotated
    angle // rad
) {
    var zAxisVector = new THREE.Vector3(0, 0, 1);
    var rotationAxis = zAxisVector.clone().cross(unitVector);
    var v;
    while (rotationAxis.length() < Number.EPSILON) {
        v = randomUnitVector();
        rotationAxis = zAxisVector.clone().cross(v);
    }
    rotationAxis.normalize();

    unitVector.fromArray(zAxisVector.toArray());

    unitVector.applyAxisAngle(rotationAxis, angle);

    return unitVector;
};

var normalizeOrRandomize = function (a) {
    if (a.length() === 0) {
        a.fromArray(randomUnitVector().toArray());
    } else {
        a.normalize();
    }
};

var closestPointOnCenteredUnitSphere = function (options) {
    var fromPoint = options.fromPoint;
    var minAngleToZAxis = options.minAngleToZAxis; // rad
    var maxAngleToZAxis = options.maxAngleToZAxis; // rad

    if (fromPoint.length() === 0) {
        fromPoint = randomUnitVector();
    }
    var a = angleToZAxis(fromPoint);
    var unitVector = fromPoint.clone().normalize();

    var pointIsInRange = a >= minAngleToZAxis && a <= maxAngleToZAxis;
    if (pointIsInRange) {
        return unitVector;
    }

    if (a < maxAngleToZAxis) {
        rotateToAngleToZAxis(unitVector, minAngleToZAxis);
        return unitVector;
    }

    if (a > maxAngleToZAxis) {
        rotateToAngleToZAxis(unitVector, maxAngleToZAxis);
        return unitVector;
    }
};

var normalizedConnectingVector = function (a, b) {
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
    normalizedConnectingVector: normalizedConnectingVector,
    areEqual: areEqual,
    tetrahedralAngle: tetrahedralAngle,
    angleToZAxis: angleToZAxis,
    tiltAnglePlusHalfTetAngle: tiltAnglePlusHalfTetAngle,
    closestPointOnCenteredUnitSphere: closestPointOnCenteredUnitSphere,
    rotateToAngleToZAxis: rotateToAngleToZAxis
};
