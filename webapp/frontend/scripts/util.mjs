/*jslint browser: true, maxlen: 80, getset: true */

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

// empricially determined, based on manual adjustments
var bandpassAttenuationCompensation = function (f) {
    return Math.max(70 / Math.sqrt(f), 1);
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

    var normalizer = audioCtx.createGain();
    noiseBandpass.connect(normalizer);

    return {
        audioNode: normalizer,
        frequency: {
            get value() {
                return noiseBandpass.frequency.value;
            },
            set value(f) {
                noiseBandpass.frequency.value = f;
                normalizer.gain.value = bandpassAttenuationCompensation(f);
            }
        },
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
