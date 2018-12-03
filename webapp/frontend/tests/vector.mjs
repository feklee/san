/*jslint node: true, maxlen: 80 */

import areEqualTest from "./vector/are-equal.mjs";
import normalizeOrRandomizeTest from "./vector/normalize-or-randomize.mjs";
import rotateToTetrahedralAngleTest from
        "./vector/rotate-to-tetrahedral-angle.mjs";
import angleToZAxisTest from "./vector/angle-to-z-axis.mjs";
import tiltAnglePlusHalfTetAngle from
        "./vector/tilt-angle-plus-half-tet-angle.mjs";

var logWhatIsTested = function (whatIsTested) {
    console.log("Testing vector." + whatIsTested + "...");
};

logWhatIsTested("areEqual");
areEqualTest();

logWhatIsTested("normalizeOrRandomize");
normalizeOrRandomizeTest();

logWhatIsTested("rotateToTetrahedralAngle");
rotateToTetrahedralAngleTest();

logWhatIsTested("angleToZAxis");
angleToZAxisTest();

logWhatIsTested("tiltAnglePlusHalfTetAngle");
tiltAnglePlusHalfTetAngle();
