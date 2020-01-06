/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors} from "./common";
import assert from "assert";

export default function () {
    var apertureOfVerticalCone;
    var axisOfTetrahedralCone;
    var intersections;

    // 1 - see 3dm file
    apertureOfVerticalCone = 2.4268803248981152; // rad

    // a
    axisOfTetrahedralCone = new THREE.Vector3(0.823, 0.465, -0.326);
    intersections = vector.intVerticalConeWTetrahedralCone(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.925, -0.150, 0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.350, 0.869, 0.350),
        0.01
    );

    // b
    axisOfTetrahedralCone = new THREE.Vector3(-0.324, 0.888, -0.326);
    intersections = vector.intVerticalConeWTetrahedralCone(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.299, 0.888, 0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(-0.800, 0.487, 0.350),
        0.001
    );

    // c
    axisOfTetrahedralCone = new THREE.Vector3(-0.102, -0.940, -0.326);
    intersections = vector.intVerticalConeWTetrahedralCone(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(-0.661, -0.664, 0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.502, -0.791, 0.350),
        0.01
    );

    // d
    axisOfTetrahedralCone = new THREE.Vector3(0.721, -0.611, -0.326);
    intersections = vector.intVerticalConeWTetrahedralCone(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.180, -0.919, 0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.936, -0.027, 0.350),
        0.001
    );

    // 2
    apertureOfVerticalCone = 3.856304982281471; // rad
    axisOfTetrahedralCone = new THREE.Vector3(0.910, -0.255, 0.326);
    intersections = vector.intVerticalConeWTetrahedralCone(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.547, -0.761, -0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.862, 0.366, -0.350),
        0.001
    );
};
