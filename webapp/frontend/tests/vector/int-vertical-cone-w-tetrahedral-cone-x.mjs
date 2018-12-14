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
    axisOfTetrahedralCone = new THREE.Vector3(0.945, 0, -0.326);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.732, -0.585, 0.350),
        0.01
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.732, 0.585, 0.350),
        0.01
    );

    // b: cones that touch
    //
    // Due to rounding errors the result is not very precise. Slightly different
    // numbers lead to no interesection points. Ideally there is just one.
    axisOfTetrahedralCone = new THREE.Vector3(0.827, 0, -0.563);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, 0.350),
        0.1
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.937, 0, 0.350),
        0.1
    );

    // c
    axisOfTetrahedralCone = new THREE.Vector3(0, 0, 1);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // d
    axisOfTetrahedralCone = new THREE.Vector3(0.561, 0, -0.828);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // 2: Cones that coincide
    apertureOfVerticalCone = 109.471; // rad
    axisOfTetrahedralCone = new THREE.Vector3(0, 0, 1);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 0); // no results due to rounding errors

    // 3: Flat vertical cone
    apertureOfVerticalCone = Math.PI; // rad
    axisOfTetrahedralCone = new THREE.Vector3(1, 0, 0);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.577, -0.816, 0),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.577, 0.816, 0),
        0.001
    );

    // 4
    apertureOfVerticalCone = 3 / 2 * Math.PI; // rad
    axisOfTetrahedralCone = new THREE.Vector3(0.991, 0, 0.133);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.677, -0.203, -0.707),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.677, 0.203, -0.707),
        0.001
    );

    // 5: infinitely thin cone pointing upwards
    apertureOfVerticalCone = 0; // rad
    axisOfTetrahedralCone = new THREE.Vector3(0.991, 0, 0.133);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // 6: infinitely thin cone pointing downwards
    apertureOfVerticalCone = 2 * Math.PI; // rad
    axisOfTetrahedralCone = new THREE.Vector3(0.991, 0, 0.133);
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisOfTetrahedralCone
    );
    assert(intersections.length === 0);
};
