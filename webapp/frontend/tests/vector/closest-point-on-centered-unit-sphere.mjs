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
    options.fromPoint = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 1-b
    options.fromPoint = new THREE.Vector3(-0.279, -0.247, 0.308);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.578, -0.511, 0.637),
        0.001
    );

    // 1-c
    options.fromPoint = new THREE.Vector3(-1.081, 0.474, -2.487);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.757, 0.332, -0.563),
        0.001
    );

    // 1-d
    options.fromPoint = new THREE.Vector3(0.029, 0.060, 0.594);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.110, 0.231, 0.967),
        0.01
    );

    // 1-e
    options.fromPoint = new THREE.Vector3(0.667, 0.489, -0.563);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.489, -0.563),
        0.001
    );

    // 1-f
    options.fromPoint = new THREE.Vector3(0, 0, 0);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnCenteredUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        angle = closestPoint.angleTo(zAxisVector);
        epsilon = 0.001;
        pointIsInRange =
                angle > options.minAngleToZAxis - epsilon &&
                angle < options.maxAngleToZAxis + epsilon;
        assert(pointIsInRange);
        i -= 1;
    }

    // 2
    options = {
        minAngleToZAxis: 0, // rad
        maxAngleToZAxis: 1.0710387487788402 // rad
    };

    // 2-a
    options.fromPoint = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 2-b
    options.fromPoint = new THREE.Vector3(0, 0, 2);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0, 0, 1),
        0.001
    );

    // 2-c
    options.fromPoint = new THREE.Vector3(0, 0, 0);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnCenteredUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        angle = closestPoint.angleTo(zAxisVector);
        epsilon = 0.001;
        pointIsInRange = angle < options.maxAngleToZAxis + epsilon;
        assert(pointIsInRange);
        i -= 1;
    }

    // 2-d
    options.fromPoint = new THREE.Vector3(-0.424, 0.292, -0.574);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.722, 0.499, 0.479),
        0.01
    );

    // 2-e
    options.fromPoint = new THREE.Vector3(0.267, 0.292, 0.249);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.571, 0.625, 0.532),
        0.001
    );

    // 3
    options = {
        minAngleToZAxis: 1.1839790046753933, // rad
        maxAngleToZAxis: Math.PI // rad
    };

    // 3-a
    options.fromPoint = new THREE.Vector3(0.183, 0.542, 1.122);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.296, 0.878, 0.377),
        0.001
    );

    // 3-b
    options.fromPoint = new THREE.Vector3(0.151, -0.350, -0.456);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.254, -0.588, -0.768),
        0.001
    );

    // 3-c
    options.fromPoint = new THREE.Vector3(0, 0, 1);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnCenteredUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        assertEqualNumbers(closestPoint.z, 0.377, 0.001);
        i -= 1;
    }

    // 3-d
    options.fromPoint = new THREE.Vector3(0, 0, -1.441);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0, 0, -1),
        0.001
    );

    // 4
    options = {
        minAngleToZAxis: 0.7366336640967267, // rad
        maxAngleToZAxis: 0.7366336640967267 // rad
    };

    // 4-a
    options.fromPoint = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.533, 0.409, 0.741),
        0.001
    );

    // 4-b
    options.fromPoint = new THREE.Vector3(0, 0, 0);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnCenteredUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        assertEqualNumbers(closestPoint.z, 0.741, 0.001);
        i -= 1;
    }

    // 5: invalid angle range => angle range ignored => whole sphere used
    options = {
        minAngleToZAxis: 0.6, // rad
        maxAngleToZAxis: 0.4 // rad
    };

    // 5-a
    options.fromPoint = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointOnCenteredUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 5-b
    options.fromPoint = new THREE.Vector3(0, 0, 0);
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnCenteredUnitSphere(options);
        assertEqualNumbers(closestPoint.length(), 1, 1e-6);
        angle = closestPoint.angleTo(zAxisVector);
        i -= 1;
    }
};
