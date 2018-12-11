/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import assert from "assert";
import {assertEqualVectors, assertEqualNumbers} from "./common";

export default function () {
    var closestPoint;
    var i;
    var zAxisVector = new THREE.Vector3(0, 0, 1);
    var angle;
    var epsilon;
    var options;
    var pointIsInRange;

    // 1 - see 3dm file
    options = {
        minAngleToZAxis: 0.2581341963699613, // rad
        maxAngleToZAxis: 2.1687635818206736 // rad
    };

    // 1-a
    options.point = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 1-b
    options.point = new THREE.Vector3(-0.279, -0.247, 0.308);
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.578, -0.511, 0.637),
        0.001
    );

    // 1-c
    options.point = new THREE.Vector3(-1.081, 0.474, -2.487);
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.757, 0.332, -0.563),
        0.001
    );

    // 1-d
    options.point = new THREE.Vector3(0.029, 0.060, 0.594);
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.110, 0.231, 0.967),
        0.01
    );

    // 1-e
    options.point = new THREE.Vector3(0.667, 0.489, -0.563);
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.489, -0.563),
        0.001
    );

    // 1-f
    options.point = new THREE.Vector3(0, 0, 0);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        angle = closestPoint.angleTo(zAxisVector);
        epsilon = 0.001;
        pointIsInRange =
                angle > options.minAngleToZAxis - epsilon &&
                angle < options.maxAngleToZAxis + epsilon;
        assert(pointIsInRange);
        i -= 1;
    }
};
