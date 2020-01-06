/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualNumbers} from "./common";

export default function () {
    var v;
    var a; // rad

    // 1 - see 3dm file
    v = new THREE.Vector3(14.881, 11.618, 10.732);
    a = vector.angleInXYPlane(v);
    assertEqualNumbers(a, 0.6628760499074463, 0.001);

    // 2
    v = new THREE.Vector3(3.000, -4, 95.000);
    a = vector.angleInXYPlane(v);
    assertEqualNumbers(a, 5.355891875594999, 0.001);

    // 3 - edge case
    v = new THREE.Vector3(0, 0, 1);
    a = vector.angleInXYPlane(v);
    assertEqualNumbers(a, 0, 0.001);
};
