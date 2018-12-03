/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualNumbers} from "./common";

export default function () {
    var a;

    a = new THREE.Vector3(0, 0, 0);
    assertEqualNumbers(vector.angleToZAxis(a), 0);

    // 1 - see 3dm file
    a = new THREE.Vector3(0, 0, 1.5);
    assertEqualNumbers(vector.angleToZAxis(a), 0);

    // 2
    a = new THREE.Vector3(0.5, 0, 0.5);
    assertEqualNumbers(vector.angleToZAxis(a), Math.PI / 4);

    // 3
    a = new THREE.Vector3(2.5, 2.5, 0);
    assertEqualNumbers(vector.angleToZAxis(a), Math.PI / 2);

    // 4
    a = new THREE.Vector3(-1.8, 2.6, -10.1);
    assertEqualNumbers(vector.angleToZAxis(a), 2.838, 0.001);

    // 5
    a = new THREE.Vector3(0, 0, -12.1);
    assertEqualNumbers(vector.angleToZAxis(a), Math.PI);
};
