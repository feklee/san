/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var compressedColorValue = function (value) {
    return String.fromCharCode(Math.floor(value / 64) + 48); // between 0 and 3
};

var compressedColor = function (color) {
    return color.map(compressedColorValue).join("");
};

var colorsCommand = function (colors) {
    return "C" + colors.map(compressedColor).join("");
};

var sendColorsToNode = function (message) {
    console.log("sending: ", colorsCommand(message.colors));
};

module.exports = sendColorsToNode;
