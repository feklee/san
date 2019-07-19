/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";
import util from "./util.mjs";
import graphicalAnalyzerSetup from "./graphical-analyzer-setup.mjs";

var audioCtx = new window.AudioContext();
var muteButtonEl = document.querySelector("button.mute");

var audioModules = {}; // There may be more audio modules maintained than nodes
                       // currently connected. This allows reconnecting a node
                       // without losing its audio settings.

audioCtx.addEventListener("statechange", function () {
    if (audioCtx.state === "suspended") {
        document.body.classList.add("muted");
    } else {
        document.body.classList.remove("muted");
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
            input.connect(module.output.input);
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

    lastAudioNode.connect(module.output.input);
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
    sourceModule.output.output.connect(destinationInput);
    destinationModule.inputIsConnectedList[destinationPortNumber] = true;

    reconnectInternalAudioNodes(destinationModule);
};

var disconnect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInput =
            destinationModule.inputs[destinationPortNumber];
    var sourceOutput = sourceModule.output.output;
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

    var analyzer = graphicalAnalyzerSetup({
        audioCtx: audioCtx,
        canvasEl: document.querySelector("canvas.audio"),
        input: inputs[1]
    });

    analyzer.connect(audioCtx.destination);

    var module = {
        inputs: inputs,
        inputIsConnectedList: inputIsConnectedList,
        internalAudioNodes: internalAudioNodes,
        modulator: "add",
        output: {
            input: analyzer,
            output: audioCtx.destination
        }
    };

    connectInternalAudioNodes[module.modulator](module);

    return module;
};

var setGeneratorOffset = function (module, value) {
    module.generator.offset.offset.value = value;
};

var enableOutputCompressor = function (module) {
    module.output.filter1Delay.disconnect();
    module.output.filter1Delay.connect(module.output.filter2Compressor);
    module.output.filter2Compressor.connect(module.output.filter3Gain);
    module.output.compressorIsEnabled = true;
};

var disableOutputCompressor = function (module) {
    module.output.filter1Delay.disconnect();
    module.output.filter1Delay.connect(module.output.filter3Gain);
    module.output.compressorIsEnabled = false;
};

var setGeneratorSource = function (module, newGenerator) {
    if (module.generator.source === newGenerator) {
        return;
    }
    if (module.generator.source) {
        module.generator.source.audioNode.disconnect();
    }
    module.generator.source = newGenerator;
    module.generator.source.audioNode.connect(
        module.generator.filter1Amplitude
    );
};

var createClipper = function () {
    var clipper = audioCtx.createWaveShaper();
    clipper.curve = new Float32Array([-1, 1]);
    return clipper;
};

var createGenerator = function () {
    var frequency = 440; // Hz

    var generator = {
        oscillationSource: util.createOscillationSource(audioCtx, frequency),
        noiseSource: util.createNoiseSource(audioCtx, frequency),
        source: undefined,
        offset: audioCtx.createConstantSource(),
        detuning: 400,
        sourceType: "sine", // TODO: also rename in messages
        frequency: frequency,
        filter1Amplitude: audioCtx.createGain(),
        filter2Offset: audioCtx.createGain(),
        filter3Clipper: createClipper(),
        output: undefined
    };

    generator.filter1Amplitude.connect(generator.filter2Offset);
    generator.offset.start();
    generator.offset.connect(generator.filter2Offset);
    generator.filter2Offset.connect(generator.filter3Clipper);

    generator.output = generator.filter3Clipper;

    return generator;
};

var createOutput = function () {
    const maxDelayTime = 1; // seconds

    var output = {
        compressorIsEnabled: false,
        input: undefined,
        filter1Delay: audioCtx.createDelay(maxDelayTime),
        filter2Compressor: audioCtx.createDynamicsCompressor(),
        filter3Gain: audioCtx.createGain(),
        filter4Clipper: createClipper(),
        output: undefined
    };

    output.filter1Delay.connect(output.filter3Gain);
    output.filter3Gain.connect(output.filter4Clipper);

    output.input = output.filter1Delay;
    output.output = output.filter4Clipper;

    return output;
};

var createModule = function (nodeId) {
    var internalAudioNodes = new Set();
    var generator = createGenerator();
    var inputs = [
        generator.output,
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

    var module = {
        generator: generator,
        internalAudioNodes: internalAudioNodes,
        inputs: inputs,
        inputIsConnectedList: inputIsConnectedList,
        output: createOutput(),
        modulator: "add"
    };

    setGeneratorSource(module, generator.oscillationSource);
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
    var source = module.generator.source;
    source.detune.value =
            module.generator.detuning * node.animatedLocation.z; // cents
};

var refreshOscillatorType = function (module) {
    if (module.generator.oscillationSource.audioNode.type !==
        module.generator.sourceType) {
        module.generator.oscillationSource.audioNode.type =
            module.generator.sourceType;
    }
};

var refreshGenerator = function (nodeId) {
    var module = getOrCreateModule(nodeId);

    if (module.generator.sourceType === "noise") {
        setGeneratorSource(module, module.generator.noiseSource);
    } else {
        setGeneratorSource(module, module.generator.oscillationSource);
        refreshOscillatorType(module);
    }

    var source = module.generator.source;
    if (source.frequency.value !== module.generator.frequency) {
        source.frequency.value = module.generator.frequency;
    }

    detuneGenerator(nodeId);
};

var refresh = function () {
    visibleNodes.forEach((node) => refreshGenerator(node.id));
};

var setOutputGain = function (module, value) {
    module.output.filter3Gain.gain.value = value;
};

var setOutputDelay = function (module, value) {
    module.output.filter1Delay.delayTime.value = value;
};

var setGeneratorAmplitude = function (module, value) {
    module.generator.filter1Amplitude.gain.value = value;
};

var setOutputCompressor = function (module, shouldBeEnabled) {
    if (module.output.compressorIsEnabled === shouldBeEnabled) {
        return;
    }

    if (module.output.compressorIsEnabled) {
        disableOutputCompressor(module);
    } else {
        enableOutputCompressor(module);
    }
};

var parseModuleMessage = function (message) {
    var nodeId = message.nodeId;
    var module = getOrCreateModule(nodeId);

    module.generator.frequency = message.generator.frequency;
    module.generator.sourceType = message.generator.sourceType;

    setGeneratorOffset(module, message.generator.offset);
    setGeneratorAmplitude(module, message.generator.amplitude);
    setOutputGain(module, message.output.gain);
    setOutputDelay(module, message.output.delay);
    setOutputCompressor(module, message.output.compressorShouldBeEnabled);

    module.generator.detuning = message.generator.detuning;

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
