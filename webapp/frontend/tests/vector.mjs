/*jslint node: true, maxlen: 80 */

import areEqual from "./vector/are-equal.mjs";
import normalizeOrRandomize from "./vector/normalize-or-randomize.mjs";
import rotateToTetrahedralAngle from
        "./vector/rotate-to-tetrahedral-angle.mjs";
import angleToZAxis from "./vector/angle-to-z-axis.mjs";
import tiltAnglePlusHalfTetAngle from
        "./vector/tilt-angle-plus-half-tet-angle.mjs";
import rotateToAngleToZAxis from
        "./vector/rotate-to-angle-to-z-axis.mjs";
import closestPointOnCenteredUnitSphere from
        "./vector/closest-point-on-centered-unit-sphere.mjs";
import closestPointOnUnitSphere from
        "./vector/closest-point-on-unit-sphere.mjs";

var logWhatIsTested = function (whatIsTested) {
    console.log("Testing vector." + whatIsTested + "...");
};

logWhatIsTested("areEqual");
areEqual();

logWhatIsTested("normalizeOrRandomize");
normalizeOrRandomize();

logWhatIsTested("rotateToTetrahedralAngle");
rotateToTetrahedralAngle();

logWhatIsTested("angleToZAxis");
angleToZAxis();

logWhatIsTested("tiltAnglePlusHalfTetAngle");
tiltAnglePlusHalfTetAngle();

logWhatIsTested("rotateToAngleToZAxis");
rotateToAngleToZAxis();

logWhatIsTested("closestPointOnCenteredUnitSphere");
closestPointOnCenteredUnitSphere();

logWhatIsTested("closestPointOnUnitSphere");
closestPointOnUnitSphere();
