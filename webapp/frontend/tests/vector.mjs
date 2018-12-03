/*jslint node: true, maxlen: 80 */

var logWhatIsTested = function (whatIsTested) {
    console.log("Testing vector." + whatIsTested + "...");
};

logWhatIsTested("areEqual");
import {} from "./vector/are-equal.mjs";

logWhatIsTested("normalizeOrRandomize");
import {} from "./vector/normalize-or-randomize.mjs";

logWhatIsTested("rotateToTetrahedralAngle");
import {} from "./vector/rotate-to-tetrahedral-angle.mjs";

logWhatIsTested("angleToZAxis");
import {} from "./vector/angle-to-z-axis.mjs";
