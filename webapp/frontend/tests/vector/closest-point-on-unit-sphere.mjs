/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors, assertEqualNumbers} from "./common";

export default function () {
    var closestPoint;
    var i;
    var options;

    // 1 - see 3dm file
    options = {
        center: new THREE.Vector3(-2.663, 1.772, 3.459),
        minAngleToVerticalAxis: 0.2581341963699613, // rad
        maxAngleToVerticalAxis: 2.1687635818206736, // rad
        fromPoint: new THREE.Vector3(-1.473, 2.686, 4.426)
    };
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(-1.996, 2.284, 4.001),
        0.001
    );

    // 2
    options = {
        center: new THREE.Vector3(0.249, -3.286, -2.595),
        minAngleToVerticalAxis: 0, // rad
        maxAngleToVerticalAxis: Math.PI / 2, // rad
        fromPoint: new THREE.Vector3(0.249, -3.286, -2.756)
    };
    i = 100;
    while (i > 0) {
        closestPoint = vector.closestPointOnUnitSphere(options);
        assertEqualNumbers(closestPoint.distanceTo(options.center), 1, 1e-6);
        assertEqualNumbers(closestPoint.z, -2.595, 0.001);
        i -= 1;
    }

    // 3
    options = {
        center: new THREE.Vector3(2, 1.4, 1.4),
        minAngleToVerticalAxis: 2.186276035465284, // rad
        maxAngleToVerticalAxis: 2.186276035465284, // rad
        fromPoint: new THREE.Vector3(2, 0.6, 1.4)
    };
    closestPoint = vector.closestPointOnUnitSphere(options);
    assertEqualVectors(
        closestPoint,
        new THREE.Vector3(2.000, 0.584, 0.823),
        0.001
    );
};
