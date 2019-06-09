/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";

var context = new window.AudioContext();
var muteButtonEl = document.querySelector("button.mute");

var audioModules = {}; // There may be more audio modules maintained than nodes
                       // currently connected. This allows reconnecting a node
                       // without losing its audio settings.

context.addEventListener("statechange", function () {
    if (context.state === "suspended") {
        muteButtonEl.textContent = "🔇";
    } else {
        muteButtonEl.textContent = "🔊";
    }
});

var toggleMute = function () {
    if (context.state === "suspended") {
        context.resume();
    } else {
        context.suspend();
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

        var multiplier = context.createGain();
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
    var input = context.createGain();
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
        null, // no oscillator
        context.createGain() // port 1
    ];
    var internalAudioNodes = new Set();
    var module = {
        inputs: inputs,
        internalAudioNodes: internalAudioNodes,
        modulator: "add",
        outputInternal: context.destination
    };

    connectInternalAudioNodes[module.modulator](module);

    return module;
};

var setOscillatorOffset = function (module, value) {
    module.oscillatorOffset.offset.value = value;
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

var createModule = function (nodeId) {
    var outputGain = context.createGain();
    var outputCompressor = context.createDynamicsCompressor();
    var clippingCurve = new Float32Array([-1, 1]);
    var outputClipper = context.createWaveShaper();
    outputClipper.curve = clippingCurve;
    const maxDelayTime = 1; // seconds
    var outputDelay = context.createDelay(maxDelayTime);
    var oscillatorFrequency = 440;
    var oscillator = context.createOscillator({frequency: oscillatorFrequency});
    var internalAudioNodes = new Set();
    var oscillatorGain = context.createGain();
    var oscillatorClipper = context.createWaveShaper();
    oscillatorClipper.curve = clippingCurve;
    var oscillatorOffset = context.createConstantSource();
    var inputs = [
        oscillatorClipper,
        null, // port 1
        null, // port 2
        null, // ...
        null
    ];

    oscillator.start();
    oscillator.connect(oscillatorGain);
    oscillatorOffset.connect(oscillatorGain);
    oscillatorOffset.start();
    oscillatorGain.connect(oscillatorClipper);

    outputDelay.connect(outputGain);
    outputGain.connect(outputClipper);

    var module = {
        oscillator: oscillator,
        oscillatorGain: oscillatorGain,
        oscillatorOffset: oscillatorOffset,
        oscillatorDetuning: 400,
        internalAudioNodes: internalAudioNodes,
        inputs: inputs,
        outputDelay: outputDelay,
        outputGain: outputGain,
        output: outputClipper,
        outputInternal: outputDelay,
        outputCompressor: outputCompressor,
        modulator: "add",
        oscillatorType: "sine",
        oscillatorFrequency: oscillatorFrequency
    };

    setOscillatorOffset(module, 0);
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

var detuneOscillator = function (nodeId) {
    var node = nodes[nodeId];
    if (node === undefined) {
        return;
    }
    var module = node.audioModule;
    var o = module.oscillator;
    o.detune.setValueAtTime( // TODO: why set value at time?
        module.oscillatorDetuning * node.animatedLocation.z, // cents
        context.currentTime
    );
};

var refreshOscillator = function (nodeId) {
    var module = getOrCreateModule(nodeId);
    var o = module.oscillator;
    if (o.frequency.value !== module.oscillatorFrequency) {
        o.frequency.value = module.oscillatorFrequency;
    }
    detuneOscillator(nodeId);
    if (o.type !== module.oscillatorType) {
        o.type = module.oscillatorType;
    }
};

var refresh = function () {
    visibleNodes.forEach((node) => refreshOscillator(node.id));
};

var setOutputGain = function (module, value) {
    module.outputGain.gain.value = value;
};

var setOutputDelay = function (module, value) {
    module.outputDelay.delayTime.value = value;
};

var setOscillatorGain = function (module, value) {
    module.oscillatorGain.gain.value = value;
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

    module.oscillatorFrequency = message.oscillator.frequency;
    module.oscillatorType = message.oscillator.type;

    setOscillatorOffset(module, message.oscillator.offset);
    setOscillatorGain(module, message.oscillator.gain);
    setOutputGain(module, message.output.gain);
    setOutputDelay(module, message.output.delay);
    setOutputCompressor(module, message.output.compressorShouldBeEnabled);

    module.oscillatorDetuning = message.oscillator.detuning;

    refreshOscillator(nodeId);

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
