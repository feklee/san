/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";
import util from "./util.mjs";

var audioCtx = new window.AudioContext();
var muteButtonEl = document.querySelector("button.mute");

var audioModules = {}; // There may be more audio modules maintained than nodes
                       // currently connected. This allows reconnecting a node
                       // without losing its audio settings.

audioCtx.addEventListener("statechange", function () {
    if (audioCtx.state === "suspended") {
        muteButtonEl.textContent = "🔇";
    } else {
        muteButtonEl.textContent = "🔊";
    }
});

var toggleMute = function () {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    } else {
        audioCtx.suspend();
    }
};

var enableMuteButton = function () {
    muteButtonEl.onclick = toggleMute;
};

var connectInternalAudioNodes = {};

connectInternalAudioNodes.add = function (module) {
    module.inputs.forEach(function (input) {
        if (input) {
            input.connect(module.outputInternal);
        }
    });
};

connectInternalAudioNodes.multiply = function (module) {
    var inputs = module.inputs;
    var internalAudioNodes = module.internalAudioNodes;
    var lastAudioNode;

    inputs.forEach(function (input) {
        if (!input) {
            return;
        }

        if (lastAudioNode === undefined) {
            lastAudioNode = input;
            return;
        }

        var multiplier = audioCtx.createGain();
        internalAudioNodes.add(multiplier);
        multiplier.gain.value = 0;
        input.connect(multiplier.gain);
        lastAudioNode.connect(multiplier);

        lastAudioNode = multiplier;
    });

    lastAudioNode.connect(module.outputInternal);
};

var disconnectInternalAudioNodes = function (module) {
    module.inputs.forEach(function (input) {
        if (input) {
            input.disconnect();
        }
    });
    var internalAudioNodes = module.internalAudioNodes;
    internalAudioNodes.forEach(function (internalAudioNode) {
        internalAudioNode.disconnect();
        internalAudioNodes.delete(internalAudioNode);
    });
};

var reconnectInternalAudioNodes = function (module) {
    disconnectInternalAudioNodes(module);
    connectInternalAudioNodes[module.modulator](module);
};

var createInput = function (module, portNumber) {
    var input = audioCtx.createGain();
    module.inputs[portNumber] = input;
    return input;
};

var connect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInput =
            createInput(destinationModule, destinationPortNumber);
    sourceModule.output.connect(destinationInput);

    reconnectInternalAudioNodes(destinationModule);
};

var destroyInput = function (module, portNumber) {
    var input = module.inputs[portNumber];
    if (input === null) {
        return;
    }
    module.inputs[portNumber] = null;
};

var disconnect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInput =
            destinationModule.inputs[destinationPortNumber];
    var sourceOutput = sourceModule.output;
    if (!destinationInput) {
        return;
    }
    if (sourceOutput.numberOfOutputs > 0) {
        try {
            sourceOutput.disconnect(destinationInput);
        } catch (ignore) {} // may not be needed, but doesn't hurt
    }
    destroyInput(destinationModule, destinationPortNumber);

    reconnectInternalAudioNodes(destinationModule);
};

var createMasterModule = function (node) {
    var inputs = [
        null, // no source
        audioCtx.createGain() // port 1
    ];
    var internalAudioNodes = new Set();
    var module = {
        inputs: inputs,
        internalAudioNodes: internalAudioNodes,
        modulator: "add",
        outputInternal: audioCtx.destination
    };

    connectInternalAudioNodes[module.modulator](module);

    return module;
};

var setSourceOffset = function (module, value) {
    module.sourceOffset.offset.value = value;
};

var enableOutputCompressor = function (module) {
    module.outputDelay.disconnect();
    module.outputDelay.connect(module.outputCompressor);
    module.outputCompressor.connect(module.outputGain);
    module.outputCompressorIsEnabled = true;
};

var disableOutputCompressor = function (module) {
    module.outputDelay.disconnect();
    module.outputDelay.connect(module.outputGain);
    module.outputCompressorIsEnabled = false;
};

var setSource = function (module, newSource) {
    if (module.source === newSource) {
        return;
    }
    if (module.source) {
        module.source.disconnect();
    }
    module.source = newSource;
    module.source.connect(module.sourceInput);
};

var createModule = function (nodeId) {
    var outputGain = audioCtx.createGain();
    var outputCompressor = audioCtx.createDynamicsCompressor();
    var clippingCurve = new Float32Array([-1, 1]);
    var outputClipper = audioCtx.createWaveShaper();
    outputClipper.curve = clippingCurve;
    const maxDelayTime = 1; // seconds
    var outputDelay = audioCtx.createDelay(maxDelayTime);
    var sourceFrequency = 440;
    var oscillator = audioCtx.createOscillator({frequency: sourceFrequency});
    var source;
    var unfilteredNoise = util.createNoiseSource(audioCtx);
    var noiseBandpass = audioCtx.createBiquadFilter();
    noiseBandpass.type = "bandpass";
    var noise = noiseBandpass;
    var internalAudioNodes = new Set();
    var sourceAmplitude = audioCtx.createGain();
    var sourceClipper = audioCtx.createWaveShaper();
    sourceClipper.curve = clippingCurve;
    var sourceOffset = audioCtx.createConstantSource();
    var sourceGain = audioCtx.createGain();
    var inputs = [
        sourceClipper,
        null, // port 1
        null, // port 2
        null, // ...
        null
    ];

    oscillator.start();
    unfilteredNoise.start();
    unfilteredNoise.connect(noiseBandpass);

    sourceAmplitude.connect(sourceGain);
    sourceOffset.start();
    sourceOffset.connect(sourceGain);
    sourceGain.connect(sourceClipper);

    outputDelay.connect(outputGain);
    outputGain.connect(outputClipper);

    var module = {
        oscillator: oscillator,
        noise: noise,
        sourceInput: sourceAmplitude,
        source: source,
        sourceAmplitude: sourceAmplitude,
        sourceOffset: sourceOffset,
        sourceDetuning: 400,
        internalAudioNodes: internalAudioNodes,
        inputs: inputs,
        outputDelay: outputDelay,
        outputGain: outputGain,
        output: outputClipper,
        outputInternal: outputDelay,
        outputCompressor: outputCompressor,
        modulator: "add",
        sourceType: "sine",
        sourceFrequency: sourceFrequency
    };

    setSource(module, oscillator);
    setSourceOffset(module, 0);
    enableOutputCompressor(module);

    connectInternalAudioNodes[module.modulator](module);

    return module;
};

var getOrCreateModule = function (nodeId) {
    var module = audioModules[nodeId];
    if (module === undefined) {
        module = createModule();
        audioModules[nodeId] = module;
    }
    return module;
};

var detuneSource = function (nodeId) {
    var node = nodes[nodeId];
    if (node === undefined) {
        return;
    }
    var module = node.audioModule;
    var source = module.source;
    source.detune.setValueAtTime( // TODO: why set value at time?
        module.sourceDetuning * node.animatedLocation.z, // cents
        audioCtx.currentTime
    );
};

var refreshOscillatorType = function (module) {
    if (module.oscillator.type !== module.sourceType) {
        module.oscillator.type = module.sourceType;
    }
};

var refreshSource = function (nodeId) {
    var module = getOrCreateModule(nodeId);

    if (module.sourceType === "noise") {
        setSource(module, module.noise);
    } else {
        setSource(module, module.oscillator);
        refreshOscillatorType(module);
    }

    var source = module.source;
    if (source.frequency.value !== module.sourceFrequency) {
        source.frequency.value = module.sourceFrequency;
    }

    detuneSource(nodeId);
};

var refresh = function () {
    visibleNodes.forEach((node) => refreshSource(node.id));
};

var setOutputGain = function (module, value) {
    module.outputGain.gain.value = value;
};

var setOutputDelay = function (module, value) {
    module.outputDelay.delayTime.value = value;
};

var setSourceAmplitude = function (module, value) {
    module.sourceAmplitude.gain.value = value;
};

var setOutputCompressor = function (module, shouldBeEnabled) {
    if (module.outputCompressorIsEnabled === shouldBeEnabled) {
        return;
    }

    if (module.outputCompressorIsEnabled) {
        disableOutputCompressor(module);
    } else {
        enableOutputCompressor(module);
    }
};

var parseModuleMessage = function (message) {
    var nodeId = message.nodeId;
    var module = getOrCreateModule(nodeId);

    module.sourceFrequency = message.source.frequency;
    module.sourceType = message.source.type;

    setSourceOffset(module, message.source.offset);
    setSourceAmplitude(module, message.source.amplitude);
    setOutputGain(module, message.output.gain);
    setOutputDelay(module, message.output.delay);
    setOutputCompressor(module, message.output.compressorShouldBeEnabled);

    module.sourceDetuning = message.source.detuning;

    refreshSource(nodeId);

    if (module.modulator !== message.modulator) {
        module.modulator = message.modulator;
        disconnectInternalAudioNodes(module);
        connectInternalAudioNodes[module.modulator](module);
    }
};

export default {
    enableMuteButton: enableMuteButton,
    getOrCreateModule: getOrCreateModule,
    createMasterModule: createMasterModule,
    connect: connect,
    disconnect: disconnect,
    refresh: refresh,
    parseModuleMessage: parseModuleMessage
};
