/*jslint node: true, maxlen: 80 */

import vector from "../../scripts/vector";
import assert from "assert";
import util from "util";

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

export {assertEqualVectors, assertEqualNumbers};
