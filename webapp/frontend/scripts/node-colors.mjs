/*jslint browser: true, maxlen: 80 */

import settings from "./settings.mjs";
import {
    nodeColorsList
} from "./shared-settings.mjs";

var nodeColorsListIndexFromId = function (id) {
    var nodeIsRootNode = id === "^";
    return nodeIsRootNode
        ? 0
        : id.charCodeAt(0) - 0x40;
};

var nodeColors = function (id) {
    var index = nodeColorsListIndexFromId(id);
    return nodeColorsList[index] ||
            [settings.defaultNodeColor, settings.defaultNodeColor];
};

export default nodeColors;
