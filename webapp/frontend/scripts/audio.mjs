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

    inputs.forEach(function (input, i) {
        var inputIsConnected = module.inputIsConnectedList[i];
        if (!inputIsConnected) {
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

var connect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInput = destinationModule.inputs[destinationPortNumber];
    sourceModule.output.connect(destinationInput);
    destinationModule.inputIsConnectedList[destinationPortNumber] = true;

    reconnectInternalAudioNodes(destinationModule);
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
            reconnectInternalAudioNodes(destinationModule);
            destinationModule.inputIsConnectedList[destinationPortNumber] =
                false;
        } catch (ignore) {} // may not be needed, but doesn't hurt
    }
};

var createMasterModule = function (node) {
    var inputs = [
        null, // generator, but the master module doesn't have a generator
        audioCtx.createGain() // port 1
    ];
    var inputIsConnectedList = [
        false,
        false
    ];
    var internalAudioNodes = new Set();
    var module = {
        inputs: inputs,
        inputIsConnectedList: inputIsConnectedList,
        internalAudioNodes: internalAudioNodes,
        modulator: "add",
        outputInternal: audioCtx.destination,
        output: audioCtx.destination
    };

    connectInternalAudioNodes[module.modulator](module);

    return module;
};

var setGeneratorOffset = function (module, value) {
    module.generatorOffset.offset.value = value;
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

var setGenerator = function (module, newGenerator) {
    if (module.generator === newGenerator) {
        return;
    }
    if (module.generator) {
        module.generator.audioNode.disconnect();
    }
    module.generator = newGenerator;
    module.generator.audioNode.connect(module.generatorInput);
};

var createModule = function (nodeId) {
    var outputGain = audioCtx.createGain();
    var outputCompressor = audioCtx.createDynamicsCompressor();
    var clippingCurve = new Float32Array([-1, 1]);
    var outputClipper = audioCtx.createWaveShaper();
    outputClipper.curve = clippingCurve;
    const maxDelayTime = 1; // seconds
    var outputDelay = audioCtx.createDelay(maxDelayTime);
    var generatorFrequency = 440; // Hz
    var oscillationGenerator =
        util.createOscillationGenerator(audioCtx, generatorFrequency);
    var generator;
    var noiseGenerator =
        util.createNoiseGenerator(audioCtx, generatorFrequency);
    var internalAudioNodes = new Set();
    var generatorAmplitude = audioCtx.createGain();
    var generatorClipper = audioCtx.createWaveShaper();
    generatorClipper.curve = clippingCurve;
    var generatorOffset = audioCtx.createConstantSource();
    var generatorGain = audioCtx.createGain();
    var inputs = [
        generatorClipper, // generator
        audioCtx.createGain(), // port 1
        audioCtx.createGain(), // port 2
        audioCtx.createGain(), // ...
        audioCtx.createGain()
    ];
    var inputIsConnectedList = [
        true, // generator
        false, // port 1
        false, // port 2
        false, // ...
        false
    ];

    generatorAmplitude.connect(generatorGain);
    generatorOffset.start();
    generatorOffset.connect(generatorGain);
    generatorGain.connect(generatorClipper);

    outputDelay.connect(outputGain);
    outputGain.connect(outputClipper);

    var module = {
        oscillationGenerator: oscillationGenerator,
        noiseGenerator: noiseGenerator,
        generatorInput: generatorAmplitude,
        generator: generator,
        generatorAmplitude: generatorAmplitude,
        generatorOffset: generatorOffset,
        generatorDetuning: 400,
        internalAudioNodes: internalAudioNodes,
        inputs: inputs,
        inputIsConnectedList: inputIsConnectedList,
        outputDelay: outputDelay,
        outputGain: outputGain,
        output: outputClipper,
        outputInternal: outputDelay,
        outputCompressor: outputCompressor,
        modulator: "add",
        generatorType: "sine",
        generatorFrequency: generatorFrequency
    };

    setGenerator(module, oscillationGenerator);
    setGeneratorOffset(module, 0);
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

var detuneGenerator = function (nodeId) {
    var node = nodes[nodeId];
    if (node === undefined) {
        return;
    }
    var module = node.audioModule;
    var generator = module.generator;
    generator.detune.setValueAtTime( // TODO: why set value at time?
        module.generatorDetuning * node.animatedLocation.z, // cents
        audioCtx.currentTime
    );
};

var refreshOscillatorType = function (module) {
    if (module.oscillationGenerator.audioNode.type !== module.generatorType) {
        module.oscillationGenerator.audioNode.type = module.generatorType;
    }
};

var refreshGenerator = function (nodeId) {
    var module = getOrCreateModule(nodeId);

    if (module.generatorType === "noise") {
        setGenerator(module, module.noiseGenerator);
    } else {
        setGenerator(module, module.oscillationGenerator);
        refreshOscillatorType(module);
    }

    var generator = module.generator;
    if (generator.frequency.value !== module.generatorFrequency) {
        generator.frequency.value = module.generatorFrequency;
    }

    detuneGenerator(nodeId);
};

var refresh = function () {
    visibleNodes.forEach((node) => refreshGenerator(node.id));
};

var setOutputGain = function (module, value) {
    module.outputGain.gain.value = value;
};

var setOutputDelay = function (module, value) {
    module.outputDelay.delayTime.value = value;
};

var setGeneratorAmplitude = function (module, value) {
    module.generatorAmplitude.gain.value = value;
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

    module.generatorFrequency = message.generator.frequency;
    module.generatorType = message.generator.type;

    setGeneratorOffset(module, message.generator.offset);
    setGeneratorAmplitude(module, message.generator.amplitude);
    setOutputGain(module, message.output.gain);
    setOutputDelay(module, message.output.delay);
    setOutputCompressor(module, message.output.compressorShouldBeEnabled);

    module.generatorDetuning = message.generator.detuning;

    refreshGenerator(nodeId);

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
