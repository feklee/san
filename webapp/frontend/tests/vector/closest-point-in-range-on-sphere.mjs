/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors} from "./common";

export default function () {
    var angleRange;
    var point;
    var closestPoint;

    // 1 - see 3dm file
    angleRange = [0.8180009138247023, 1.9802156627277263]; // [rad, rad]

    // 1-A
    point = new THREE.Vector3(1.190, 0.914, 0.967);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(0.667, 0.512, 0.542),
        0.001
    );

    // 1-B
    point = new THREE.Vector3(-0.279, -0.247, 0.308);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.578, -0.511, 0.637),
        0.001
    );

    // 1-C
    point = new THREE.Vector3(-1.081, 0.474, -2.487);
    closestPoint = vector.closestPointInRangeOnSphere(angleRange, point);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-0.757, 0.332, -0.563),
        0.001
    );
};
