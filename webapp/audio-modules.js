/*jslint node: true, getset: true, maxlen: 80 */

"use strict";

var container = {};

function store(audioModule) {
    var nodeId = audioModule.nodeId;
    if (nodeId) {
        container[nodeId] = audioModule;
    }
}

function forEach(f) {
    Object.keys(container).forEach(f);
}

module.exports = {
    store: store,
    forEach: forEach
};
