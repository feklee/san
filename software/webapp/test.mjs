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

var a;
var b;

a = new THREE.Vector3(0, 0, 0);
assert(vector.areEqual(a, a.clone()));

a = new THREE.Vector3(0, 0, 0);
b = new THREE.Vector3(0, 0.01, 0);
assert(!vector.areEqual(a, b));
assert(vector.areEqual(a, b, 0.011));

a = new THREE.Vector3(-0.01, -0.01, -0.01);
b = new THREE.Vector3(0, 0, 0);
assert(!vector.areEqual(a, b));
assert(vector.areEqual(a, b, 0.011));

a = new THREE.Vector3(0, 0, 0);
vector.normalizeOrRandomize(a);
//assertEqualNumbers(a.length(), 1);
