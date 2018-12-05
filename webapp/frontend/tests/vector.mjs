/*jslint node: true, maxlen: 80 */

import areEqual from "./vector/are-equal.mjs";
import normalizeOrRandomize from "./vector/normalize-or-randomize.mjs";
import rotateToTetrahedralAngle from
        "./vector/rotate-to-tetrahedral-angle.mjs";
import angleToZAxis from "./vector/angle-to-z-axis.mjs";
import tiltAnglePlusHalfTetAngle from
        "./vector/tilt-angle-plus-half-tet-angle.mjs";
import closestPointInRangeOnSphere from
        "./vector/closest-point-in-range-on-sphere.mjs";
import rotateToAngleToZAxis from
        "./vector/rotate-to-angle-to-z-axis.mjs";

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

logWhatIsTested("closestPointInRangeOnSphere");
closestPointInRangeOnSphere();

logWhatIsTested("rotateToAngleToZAxis");
rotateToAngleToZAxis();
