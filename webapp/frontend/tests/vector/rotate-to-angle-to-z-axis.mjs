/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualNumbers, assertEqualVectors} from "./common";

export default function () {
    var unitVector;
    var u;
    var i;
    var zAxisVector = new THREE.Vector3(0, 0, 1);

    // 1 - see 3dm file
    unitVector = new THREE.Vector3(0.160, 0.080, 0.984);

    // 1-a
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 0);
    assertEqualVectors(u, new THREE.Vector3(0, 0, 1));

    // 1-b
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 0.7853981633974483);
    assertEqualVectors(u, new THREE.Vector3(0.632, 0.316, 0.707), 0.001);

    // 1-c
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 1.5707963267948966);
    assertEqualVectors(u, new THREE.Vector3(0.894, 0.447, 0.000), 0.001);

    // 1-d
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 2.356194490192345);
    assertEqualVectors(u, new THREE.Vector3(0.632, 0.316, -0.707), 0.001);

    // 1-e
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 3.141592653589793);
    assertEqualVectors(u, new THREE.Vector3(0, 0, -1), 0.001);

    // 1-f
    u = unitVector.clone();
    vector.rotateToAngleToZAxis(u, 3.9269908169872414);
    assertEqualVectors(u, new THREE.Vector3(-0.632, -0.316, -0.707), 0.001);

    // 2
    u = new THREE.Vector3(-0.160, 0.079, 0.984);
    vector.rotateToAngleToZAxis(u, 0.7853981633974483);
    assertEqualVectors(u, new THREE.Vector3(-0.634, 0.313, 0.707), 0.001);

    // 3
    u = new THREE.Vector3(-0.124, -0.129, 0.984);
    vector.rotateToAngleToZAxis(u, 0.7853981633974483);
    assertEqualVectors(u, new THREE.Vector3(-0.490, -0.510, 0.707), 0.001);

    // 4
    u = new THREE.Vector3(0.173, -0.046, 0.984);
    vector.rotateToAngleToZAxis(u, 0.7853981633974483);
    assertEqualVectors(u, new THREE.Vector3(0.683, -0.182, 0.707), 0.001);

    // 5
    u = new THREE.Vector3(0.160, 0.080, -0.984);
    vector.rotateToAngleToZAxis(u, 0.7853981633974483);
    assertEqualVectors(u, new THREE.Vector3(0.632, 0.316, 0.707), 0.001);

    // 6
    unitVector = new THREE.Vector3(0, 0, 1);
    i = 100;
    while (i > 0) {
        u = unitVector.clone();
        vector.rotateToAngleToZAxis(u, 0.7853981633974483);
        assertEqualNumbers(u.angleTo(zAxisVector), 0.7853981633974483, 1e-6);
        i -= 1;
    }

    // 7
    unitVector = new THREE.Vector3(0, 0, -1);
    i = 100;
    while (i > 0) {
        u = unitVector.clone();
        vector.rotateToAngleToZAxis(u, 0.7853981633974483);
        assertEqualNumbers(u.angleTo(zAxisVector), 0.7853981633974483, 1e-6);
        i -= 1;
    }
};
