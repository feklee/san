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

function impulseResponse(audioCtx, duration, decay) { // TODO: replace with something that works
    var sampleRate = audioCtx.sampleRate;
    var length = sampleRate * duration;
    var impulse = audioCtx.createBuffer(1, length, sampleRate);
    var impulseL = impulse.getChannelData(0);

    for (var i = 0; i < length; i++){
      var n = i;
      impulseL[i] = 1 * Math.pow(1 - n / length, decay);
    }
    return impulse;
}

var createNormalizer = function (audioCtx) {
    var convolverNode = audioCtx.createConvolver();
    convolverNode.normalize = true;
    convolverNode.buffer = impulseResponse(audioCtx, 4, 100000, false);
    return convolverNode;
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

    var normalizer = createNormalizer(audioCtx);
    noiseBandpass.connect(normalizer);

    return {
        audioNode: normalizer,
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
