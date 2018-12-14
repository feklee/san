/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors} from "./common";
import assert from "assert";

export default function () {
    var apertureOfVerticalCone;
    var axisOfOtherCone;
    var intersections;

    // 1 - see 3dm file
    apertureOfVerticalCone = 2.4268803248981152; // rad
    axisOfOtherCone = new THREE.Vector3(0.945, 0, -0.326);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfOtherCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.732, -0.585, 0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.732, 0.585, 0.350),
        0.001
    );
};
