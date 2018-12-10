/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import assert from "assert";
import {assertEqualVectors, assertEqualNumbers} from "./common";

export default function () {
    var angleRange;
    var point;
    var closestPoint;
    var i;
    var zAxisVector = new THREE.Vector3(0, 0, 1);
    var angle;
    var epsilon;

    // 1 - see 3dm file
    angleRange = [0.2581341963699613, 2.1687635818206736]; // [rad, rad]

    // 1-a
    point = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 1-b
    point = new THREE.Vector3(-0.279, -0.247, 0.308);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.578, -0.511, 0.637),
        0.001
    );

    // 1-c
    point = new THREE.Vector3(-1.081, 0.474, -2.487);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.757, 0.332, -0.563),
        0.001
    );

    // 1-d
    point = new THREE.Vector3(0.029, 0.060, 0.594);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.110, 0.231, 0.967),
        0.01
    );

    // 1-e
    point = new THREE.Vector3(0.667, 0.489, -0.563);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.489, -0.563),
        0.001
    );

    // 1-f
    point = new THREE.Vector3(0, 0, 0);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        angle = closestPoint.angleTo(zAxisVector);
        epsilon = 0.001;
        assert(
            angle > angleRange[0] - epsilon &&
                angle < angleRange[1] + epsilon
        );
        i -= 1;
    }
};
