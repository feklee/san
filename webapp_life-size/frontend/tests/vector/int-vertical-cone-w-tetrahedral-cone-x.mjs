/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualVectors} from "./common";
import assert from "assert";

export default function () {
    var apertureOfVerticalCone;
    var axisAngleOfTetrahedralCone;
    var intersections;

    // 1 - see 3dm file
    apertureOfVerticalCone = 2.4268803248981152; // rad

    // a
    axisAngleOfTetrahedralCone = 1.9033688157624162; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
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

    // b: cones that touch
    //
    // Ideally there is just one intersection point. Due to rounding errors, two
    // points are returned.
    axisAngleOfTetrahedralCone = 2.168728675235634; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, 0.350),
        0.01
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.937, 0, 0.350),
        0.01
    );

    // c: cones that touch, but due to rounding errors they mathematically are
    // slightly separate
    axisAngleOfTetrahedralCone = 2.1687635818206736; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, 0.350),
        0.001
    );

    // d
    axisAngleOfTetrahedralCone = 4.114421725358913; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(-0.937, 0, 0.350),
        0.001
    );

    // 2: like 1, but flipped
    apertureOfVerticalCone = 3.856304982281471; // rad

    // a
    axisAngleOfTetrahedralCone = 1.238223837827377; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.732, -0.585, -0.350),
        0.001
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.732, 0.585, -0.350),
        0.001
    );

    // b
    axisAngleOfTetrahedralCone = 0.9728639783541593; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 2);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, -0.350),
        0.01
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.937, 0, -0.350),
        0.01
    );

    // c
    axisAngleOfTetrahedralCone = 0.9728290717691194; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, -0.350),
        0.001
    );

    // d
    axisAngleOfTetrahedralCone = 5.310356235410467; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(-0.937, 0, -0.350),
        0.001
    );

    // 3: Cones coincide. Just one point is returned, since returning all points
    //  is infeasible (there is an infinited number), and this is a rare if not
    //  impossible edge case.
    apertureOfVerticalCone = vector.tetrahedralAngle; // rad
    axisAngleOfTetrahedralCone = 0; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.816, 0, 0.577),
        0.001
    );

    // 4: flat vertical cone
    apertureOfVerticalCone = Math.PI; // rad
    axisAngleOfTetrahedralCone = Math.PI / 2; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
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

    // 5
    apertureOfVerticalCone = 3 / 2 * Math.PI; // rad
    axisAngleOfTetrahedralCone = 1.4373135456023705; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
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

    // 6: cones that touch, with heavy rounding error observed in real world
    // situation
    apertureOfVerticalCone = 3.036872898470133; // rad
    axisAngleOfTetrahedralCone = 2.498089758379484; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.999, 0, 0.052),
        0.001
    );
};
