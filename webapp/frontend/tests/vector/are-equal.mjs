/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import assert from "assert";

export default function () {
    var a;
    var b;

    a = new THREE.Vector3(0, 0, 0);
    assert(vector.areEqual(a, a.clone()));

    a = new THREE.Vector3(2, 3, 5);
    b = new THREE.Vector3(2, 3.01, 5);
    assert(!vector.areEqual(a, b));
    assert(vector.areEqual(a, b, 0.011));

    a = new THREE.Vector3(-0.01, -0.01, -0.01);
    b = new THREE.Vector3(0, 0, 0);
    assert(!vector.areEqual(a, b));
    assert(vector.areEqual(a, b, 0.011));
};
