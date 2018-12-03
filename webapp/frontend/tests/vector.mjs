/*jslint node: true, maxlen: 80 */

import assert from "assert";
import util from "util";
import THREE from "./global-three";
import vector from "../scripts/vector";

var logWhatIsTested = function (whatIsTested) {
    console.log("Testing vector." + whatIsTested + "...");
};

logWhatIsTested("areEqual");
import {} from "./vector/are-equal.mjs";

logWhatIsTested("normalizeOrRandomize");
import {} from "./vector/normalize-or-randomize.mjs";

logWhatIsTested("rotateToTetrahedralAngle");
