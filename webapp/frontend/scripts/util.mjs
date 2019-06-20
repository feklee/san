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

var createRawNoiseGenerator = function (audioCtx) {
    const noiseLength = 10; // s
    const bufferSize = audioCtx.sampleRate * noiseLength;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    var i = 0;

    while (i < bufferSize) {
        data[i] = Math.random() * 2 - 1;
        i += 1;
    }

    var audioNode = audioCtx.createBufferSource();
    audioNode.buffer = buffer;
    audioNode.loop = true;
    audioNode.start();
    return audioNode;
};

var createNoiseGenerator = function (
    audioCtx,
    frequency // Hz
) {
    var rawNoise = createRawNoiseGenerator(audioCtx);
    var noiseBandpass = audioCtx.createBiquadFilter();
    noiseBandpass.type = "bandpass";
    noiseBandpass.frequency.value = frequency;

    rawNoise.connect(noiseBandpass);

    return {
        audioNode: noiseBandpass,
        frequency: noiseBandpass.frequency,
        detune: noiseBandpass.detune
    };
};

var createOscillationGenerator = function (
    audioCtx,
    frequency // Hz
) {
    var oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.start();

    return {
        audioNode: oscillator,
        frequency: oscillator.frequency,
        detune: oscillator.detune
    };
};

export default {
    connectionExpiryTime: connectionExpiryTime,
    nodeIsRootNode: nodeIsRootNode,
    createNoiseGenerator: createNoiseGenerator,
    createOscillationGenerator: createOscillationGenerator
};
