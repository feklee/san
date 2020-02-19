/*jslint browser: true, maxlen: 80 */

import {
    nodeColorsList
} from "./shared-settings.mjs";

var colorsOfNodes = {};

var nodeId = function (i) {
    return String.fromCharCode(0x41 + i);
};

var initializeWithDefaultValues = function () {
    colorsOfNodes["^"] = nodeColorsList[0];
    nodeColorsList.slice(1).forEach(
        function (nodeColors, i) {
            colorsOfNodes[nodeId(i)] = nodeColors;
        }
    );
};

initializeWithDefaultValues();

export default colorsOfNodes;
