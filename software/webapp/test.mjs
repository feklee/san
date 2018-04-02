/*jslint node: true, maxlen: 80 */

import assert from "assert";
import util from "util";
import THREE from "./global-three";
import vector from "./public/scripts/vector";

var assertEqualVectors = function (a, b, epsilon) {
    return assert(
        vector.areEqual(a, b, epsilon),
        util.format(
            "Vectors (%f, %f, %f), (%f, %f, %f) differ",
            a.x,
            a.y,
            a.z,
            b.x,
            b.y,
            b.z
        )
    );
};

var assertEqualNumbers = function (actual, expected, epsilon) {
    if (epsilon === undefined) {
        epsilon = Number.EPSILON;
    }
    return assert(
        Math.abs(actual - expected) < epsilon,
        util.format("|%f - %f| < epsilon", actual, expected)
    );
};

var logWhatIsTested = function (whatIsTested) {
    console.log("Testing " + whatIsTested + "...");
};

var a;
var b;
const tetrahedralAngle = Math.acos(-1 / 3);

logWhatIsTested("vector.areEqual");

a = new THREE.Vector3(0, 0, 0);
assert(vector.areEqual(a, a.clone()));

a = new THREE.Vector3(2, 3, 5);
b = new THREE.Vector3(2, 3.01, 5);
assert(!vector.areEqual(a, b));
assert(vector.areEqual(a, b, 0.011));

a = new THREE.Vector3(-0.01, -0.01, -0.01);
b = new THREE.Vector3(0, 0, 0);
assert(!vector.areEqual(a, b));
assert(vector.areEqual(a, b, 0.011));

logWhatIsTested("vector.normalizeOrRandomize");

a = new THREE.Vector3(0, 0, 0);
vector.normalizeOrRandomize(a);
assertEqualNumbers(a.length(), 1);

logWhatIsTested("vector.rotateToTetrahedralAngle");

// 1 - see 3dm file
a = new THREE.Vector3(0, 1, 0);
b = new THREE.Vector3(-1, 0, 0);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(a, new THREE.Vector3(0, 1, 0));
assertEqualVectors(b, new THREE.Vector3(-0.942809, -0.333333, 0), 1e-6);

// 2
a = new THREE.Vector3(0, 1, 0);
b = new THREE.Vector3(-0.707107, -0.707107, 0);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(-0.942809, -0.333333, 0), 1e-6);

// 3
a = new THREE.Vector3(0, 1, 0);
b = new THREE.Vector3(0.707107, -0.707107, 0);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(0.942809, -0.333333, 0), 1e-6);

// 4
a = new THREE.Vector3(0, -1, 0);
b = new THREE.Vector3(0.707107, 0.707107, 0);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(0.942809, 0.333333, 0), 1e-6);

// 5
a = new THREE.Vector3(-0.481893, -0.0998726, 0.870519);
b = new THREE.Vector3(0.374953, -0.632951, -0.677336);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(0.206235, -0.904804, -0.372554), 1e-6);

// 6
a = new THREE.Vector3(0.320078, -0.740914, 0.590421);
b = new THREE.Vector3(0.386823, -0.584146, 0.713541);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(0.226225, 0.880162, 0.417298), 1e-5);

// 7
a = new THREE.Vector3(-0.190738, -0.45128, -0.87176);
b = new THREE.Vector3(0.194294, 0.416757, 0.888011);
vector.rotateToTetrahedralAngle(a, b);
assertEqualVectors(b, new THREE.Vector3(0.15452, -0.690919, 0.706225), 1e-5);

var i = 100;
while (i > 0) {
    a = new THREE.Vector3(0, 0, 1);
    b = new THREE.Vector3(0, 0, 1); // a || b
    vector.rotateToTetrahedralAngle(a, b);
    assertEqualNumbers(b.angleTo(a), tetrahedralAngle, 1e-6);
    i -= 1;
}
