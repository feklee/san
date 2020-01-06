/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors} from "./common";
import assert from "assert";

export default function () {
    var fromPoint;
    var pointsToSelectFrom;
    var closestPoint;

    fromPoint = new THREE.Vector3(1, 2, 2);
    pointsToSelectFrom = [
        new THREE.Vector3(2, -1, 0),
        new THREE.Vector3(1, 3, 2),
        new THREE.Vector3(2, 2, 2)
    ];
    closestPoint = vector.closestPoint(fromPoint, pointsToSelectFrom);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(1, 3, 2),
        0.001
    );

    fromPoint = new THREE.Vector3(0, 0, 0);
    pointsToSelectFrom = [];
    closestPoint = vector.closestPoint(fromPoint, pointsToSelectFrom);
    assert(closestPoint === undefined);
};
