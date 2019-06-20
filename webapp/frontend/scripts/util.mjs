/*jslint browser: true, maxlen: 80 */

import {
    connectionExpiryDuration // ms
} from "./shared-settings.mjs";

var connectionExpiryTime = function () { // ms
    return Date.now() + connectionExpiryDuration;
};

var nodeIsRootNode = function (id) {
    return id === "^";
};

var createNoiseGenerator = function (context) {
    const noiseLength = 10; // s
    const bufferSize = context.sampleRate * noiseLength;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    var data = buffer.getChannelData(0);
    var i = 0;

    while (i < bufferSize) {
        data[i] = Math.random() * 2 - 1;
        i += 1;
    }

    var bs = context.createBufferSource();
    bs.buffer = buffer;
    bs.loop = true;
    return bs;
};

export default {
    connectionExpiryTime: connectionExpiryTime,
    nodeIsRootNode: nodeIsRootNode,
    createNoiseGenerator: createNoiseGenerator
};
