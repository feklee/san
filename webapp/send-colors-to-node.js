/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

const http = require("http");
const physicalConnection = require("./physical-connection");
var sharedSettings = require("./shared-settings");

var ipOfNode = function (nodeId) {
    return sharedSettings.gw.slice(0, 3).concat([nodeId.charCodeAt() + 36]);
};

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
    if (physicalConnection.type !== "wifi") {
        return;
    }
    var url = "http://" + ipOfNode(message.nodeId).join(".") + "?" +
            colorsCommand(message.colors);
    http.get(url);
};

module.exports = sendColorsToNode;
