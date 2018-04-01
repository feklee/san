/*jslint node: true, maxlen: 80 */

import vector from "./public/scripts/vector";

import assert from "assert";
import util from "util";
import THREE from "three";

var assertNumEqual = function (actual, expected, epsilon) {
    if (epsilon === undefined) {
        epsilon = 0.00001; // small but arbitrary
    }
    return assert(
        Math.abs(actual - expected) < epsilon,
        util.format("|%d - %d| < epsilon", actual, expected)
    );
};


assertNumEqual(0, 1);
