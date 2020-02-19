/*jslint browser: true, maxlen: 80 */

import {
    nodeColorsList
} from "./shared-settings.mjs";
import colorConvert from "color-convert";
import renderMatrix from "./render-matrix.mjs";

var rgbColorsOfNodes = {};

var nodeId = function (i) {
    return String.fromCharCode(0x41 + i);
};

var rgbColorsFromHemisphereColors = function (hemisphereColors) {
    return [
        colorConvert.keyword.rgb(hemisphereColors[0]),
        colorConvert.keyword.rgb(hemisphereColors[0]),
        colorConvert.keyword.rgb(hemisphereColors[1]),
        colorConvert.keyword.rgb(hemisphereColors[1])
    ];
};

var initializeWithDefaultValues = function () {
    rgbColorsOfNodes["^"] = rgbColorsFromHemisphereColors(nodeColorsList[0]);
    nodeColorsList.slice(1).forEach(
        function (hemisphereColors, i) {
            rgbColorsOfNodes[nodeId(i)] =
                    rgbColorsFromHemisphereColors(hemisphereColors);
        }
    );
};

var cssColorFromRgbColor = function (rgbColor) {
    return "rgb(" + rgbColor.join(",") + ")";
};

var rgbColorsOfNode = function (nodeId) {
    return rgbColorsOfNodes[nodeId];
};

var cssColorsOfNode = function (nodeId) {
    var rgbColors = rgbColorsOfNode(nodeId);
    return rgbColors.map(cssColorFromRgbColor);
};

var parseNodeColorsMessage = function (message) {
    rgbColorsOfNodes[message.nodeId] = message.colors;
    renderMatrix();
};

initializeWithDefaultValues();

export {
    cssColorsOfNode,
    rgbColorsOfNode,
    parseNodeColorsMessage
};
