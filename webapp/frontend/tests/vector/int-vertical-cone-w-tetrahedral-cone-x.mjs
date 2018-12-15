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
        0.01
    );
    assertEqualVectors(
        intersections[1],
        new THREE.Vector3(0.732, 0.585, 0.350),
        0.01
    );

    // b: cones that touch
    //
    // Ideally there is just one intersection point, but there are rounding
    // errors.
    axisAngleOfTetrahedralCone = 2.168728675235634; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
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

    // c: cones that touch, but due to rounding errors they are slightly
    // separate
    axisAngleOfTetrahedralCone = 2.1687635818206736; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 1);
    assertEqualVectors(
        intersections[0],
        new THREE.Vector3(0.937, 0, 0.350),
        0.1
    );

    // d
    axisAngleOfTetrahedralCone = 0; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // e
    axisAngleOfTetrahedralCone = 2.546016499639248; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // 2: Cones that coincide
    apertureOfVerticalCone = 109.471; // rad
    axisAngleOfTetrahedralCone = 0; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 0); // no results due to rounding errors

    // 3: Flat vertical cone
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

    // 4
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

    // 5: infinitely thin cone pointing upwards
    apertureOfVerticalCone = 0; // rad
    axisAngleOfTetrahedralCone = 1.4373135456023705; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // 6: infinitely thin cone pointing downwards
    apertureOfVerticalCone = 2 * Math.PI; // rad
    axisAngleOfTetrahedralCone = 1.4373135456023705; // rad
    intersections = vector.intVerticalConeWTetrahedralConeX(
        apertureOfVerticalCone,
        axisAngleOfTetrahedralCone
    );
    assert(intersections.length === 0);

    // 7
// TODO: test cones that almost touch in all constellations
/* TODO
    apertureOfVerticalCone = 6.178465552059927; // rad
    axisAngleOfTetrahedralCone = new THREE.Vector3(0, -0.8, 0.6);
*/
    // TODO: Test angles out of range
};
