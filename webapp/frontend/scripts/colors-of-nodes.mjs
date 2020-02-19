/*jslint browser: true, maxlen: 80 */

import {
    nodeColorsList
} from "./shared-settings.mjs";

var colorsOfNodes = {};

var nodeId = function (i) {
    return String.fromCharCode(0x41 + i);
};

var colorsFromHemisphereColors = function (hemisphereColors) {
    return [
        hemisphereColors[0],
        hemisphereColors[0],
        hemisphereColors[1],
        hemisphereColors[1]
    ];
};

var initializeWithDefaultValues = function () {
    colorsOfNodes["^"] = nodeColorsList[0];
    nodeColorsList.slice(1).forEach(
        function (hemisphereColors, i) {
            colorsOfNodes[nodeId(i)] =
                    colorsFromHemisphereColors(hemisphereColors);
        }
    );
};

initializeWithDefaultValues();

export default colorsOfNodes;
