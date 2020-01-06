/*jslint node: true, browser: true, maxlen: 80 */

/*global THREE, global*/

var windowType = typeof "window";
var runningInNode = windowType === "undefined";
if (runningInNode) {
    THREE = global.THREE;
}

const tetrahedralAngle = Math.acos(-1 / 3); // rad
const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);

var angleToZAxis = function (vector) {
    if (vector.length() < Number.EPSILON) {
        return 0;
    }
    return vector.angleTo(zAxis);
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
    tiltAngle // rad
) {
    tiltAngle = tiltAngle % (2 * Math.PI);

    if (tiltAngle < 0) {
        // may happen due to rounding errors in certain edge cases
        tiltAngle += 2 * Math.PI;
    }

    var angleIsExcludedAngle = tiltAngle > Math.PI;
    if (angleIsExcludedAngle) {
        // may happen due to rounding errors in certain edge cases
        tiltAngle = 2 * Math.PI - tiltAngle;
    }

    var hta = tetrahedralAngle / 2; // rad
    var min = tiltAngle - hta; // rad
    var max = tiltAngle + hta; // rad

    if (min < 0) {
        min = -min;
    }

    if (max > Math.PI) {
        max = 2 * Math.PI - max;
    }

    return [min, max];
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

    var rangeIsInvalid = minAngleToZAxis > maxAngleToZAxis;
    if (rangeIsInvalid) {
        // can happen due to rounding errors when angles are nearby
        maxAngleToZAxis = minAngleToZAxis;
    }

    if (fromPoint.length() === 0) {
        fromPoint = randomUnitVector();
    }
    var a = angleToZAxis(fromPoint);
    var unitVector = fromPoint.clone().normalize();

    var fromPointIsInRange = a >= minAngleToZAxis && a <= maxAngleToZAxis;
    if (fromPointIsInRange) {
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

var closestPointOnUnitSphere = function (options) {
    var fromPoint = options.fromPoint;
    var center = options.center;
    var minAngleToVerticalAxis = options.minAngleToVerticalAxis; // rad
    var maxAngleToVerticalAxis = options.maxAngleToVerticalAxis; // rad

    var shiftedFromPoint = fromPoint.clone().sub(center);
    var shiftedClosestPoint = closestPointOnCenteredUnitSphere({
        fromPoint: shiftedFromPoint,
        minAngleToZAxis: minAngleToVerticalAxis, // rad
        maxAngleToZAxis: maxAngleToVerticalAxis // rad
    });

    return shiftedClosestPoint.add(center);
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

var angleInXYPlane = // rad, measured against positive x axis (2D, projected)
    function (vector) {
        var projectedVector = new THREE.Vector2(vector.x, vector.y);
        return projectedVector.angle();
    };

// Returns an array of unit vectors that go along the intersection of two cones:
//
//   * The apex of both cones is in the origin.
//
//   * One cone is vertical.
//
//   * The tetrahedral cone has a fixed aperture equaling the tetrahedral angle.
//
//   * The cones are assumed to intersect. (or to intersect almost, possibly due
//     to rounding errors)
var intVerticalConeWTetrahedralConeX =
    function (
        apertureOfVerticalCone, // in [0, 2 pi rad]
        axisAngleOfTetrahedralCone // angle to z axis, in direction of x axis
    ) {
        const a = apertureOfVerticalCone / 2; // rad
        const x = Math.sin(axisAngleOfTetrahedralCone);
        const z = Math.cos(axisAngleOfTetrahedralCone);
        var angle;

        if (Math.abs(x) < Number.EPSILON) {
            // tedrahedral cone vertical => cones coincide (following the
            // assumption that they intersect) => chose a point on the vertical
            // cone
            angle = apertureOfVerticalCone / 2;
            return [new THREE.Vector3(
                Math.sin(angle),
                0,
                Math.cos(angle)
            )];
        }

        const w = Math.cos(a);
        const u = (Math.sqrt(1 / 3) - z * w) / x;
        const radicant = 1 - u * u - w * w;

        if (radicant < 0) {
            // no intersection points found => assumption: this is due to
            // rounding errors which can happen when cones barely touch =>
            // choose closest point on vertical cone
            angle = Math.sign(x) * apertureOfVerticalCone / 2;
            return [new THREE.Vector3(
                Math.sin(angle),
                0,
                Math.cos(angle)
            )];
        }

        var v = Math.sqrt(radicant);
        if (v === 0) {
            return [new THREE.Vector3(u, v, w)];
        } else {
            return [
                new THREE.Vector3(u, -v, w),
                new THREE.Vector3(u, v, w)
            ];
        }
    };

var intVerticalConeWTetrahedralCone =
    function (
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    ) {
        var a = angleInXYPlane(axisOfTetrahedralCone);
        var intersections = intVerticalConeWTetrahedralConeX(
            apertureOfVerticalCone,
            angleToZAxis(axisOfTetrahedralCone)
        );
        intersections.forEach(
            function (intersection) {
                intersection.applyAxisAngle(zAxis, a);
            }
        );
        return intersections;
    };

var indexOfClosestPoint = function (fromPoint, pointsToSelectFrom) {
    var selectedIndex;
    var shortestDistance = Number.MAX_VALUE;
    pointsToSelectFrom.forEach(function (point, i) {
        const distance = fromPoint.distanceTo(point);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            selectedIndex = i;
        }
    });
    return selectedIndex;
};

var closestPoint = function (fromPoint, pointsToSelectFrom) {
    return pointsToSelectFrom[indexOfClosestPoint(
        fromPoint, pointsToSelectFrom
    )];
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
    closestPointOnUnitSphere: closestPointOnUnitSphere,
    rotateToAngleToZAxis: rotateToAngleToZAxis,
    angleInXYPlane: angleInXYPlane,
    intVerticalConeWTetrahedralConeX: intVerticalConeWTetrahedralConeX,
    intVerticalConeWTetrahedralCone: intVerticalConeWTetrahedralCone,
    xAxis: xAxis,
    yAxis: yAxis,
    zAxis: zAxis,
    indexOfClosestPoint: indexOfClosestPoint,
    closestPoint: closestPoint
};
