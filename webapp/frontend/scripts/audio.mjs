/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";

var context = new window.AudioContext();
var muteButtonEl = document.querySelector("button.mute");

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

    node.audioModule = module;

    connectInternalAudioNodes[module.modulator](module);
};

var setOscillatorOffset = function (module, value) {
    module.oscillatorOffset.offset.value = value;
};

var createModule = function (node) {
    var outputGain = context.createGain();
    const maxDelayTime = 1; // seconds
    var outputDelay = context.createDelay(maxDelayTime);
    var baseFreq = 440;
    var oscillator = context.createOscillator({frequency: baseFreq});
    var internalAudioNodes = new Set();
    var oscillatorGain = context.createGain();
    var oscillatorOffset = context.createConstantSource();
    var inputs = [
        oscillatorGain,
        null, // port 1
        null, // port 2
        null, // ...
        null
    ];

    oscillatorOffset.connect(oscillatorGain);
    oscillatorOffset.start();
    oscillator.connect(oscillatorGain);
    oscillator.start();

    outputDelay.connect(outputGain);

    var module = {
        oscillator: oscillator,
        oscillatorGain: oscillatorGain,
        oscillatorOffset: oscillatorOffset,
        internalAudioNodes: internalAudioNodes,
        inputs: inputs,
        outputDelay: outputDelay,
        outputGain: outputGain,
        output: outputGain,
        outputInternal: outputDelay,
        modulator: "add",
        oscillatorType: "sine",
        baseFreq: baseFreq
    };
    node.audioModule = module;

    setOscillatorOffset(module, 0);

    connectInternalAudioNodes[module.modulator](module);
};

var destroyModule = function (node) {
    var module = node.audioModule;
    disconnectInternalAudioNodes(module);
    module.oscillator.stop();
    module.oscillatorOffset.disconnect();
    module.oscillatorOffset.stop();
};

var refreshOscillator = function (node) {
    var module = node.audioModule;
    var o = module.oscillator;
    if (o.frequency.value !== module.baseFreq) {
        o.frequency.value = module.baseFreq;
    }
    o.detune.setValueAtTime(400 * node.animatedLocation.z, context.currentTime);
    if (o.type !== module.oscillatorType) {
        o.type = module.oscillatorType;
    }
};

var refresh = function () {
    visibleNodes.forEach(refreshOscillator);
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

var parseModuleMessage = function (message) {
    var node = nodes[message.nodeId];
    var module = node.audioModule;
    module.baseFreq = message.baseFreq;
    module.oscillatorType = message.oscillatorType;

    setOscillatorOffset(module, message.oscillatorOffset);
    setOscillatorGain(module, message.oscillatorGain);
    setOutputGain(module, message.outputGain);
    setOutputDelay(module, message.outputDelay);

    refreshOscillator(node);

    if (module.modulator !== message.modulator) {
        module.modulator = message.modulator;
        disconnectInternalAudioNodes(module);
        connectInternalAudioNodes[module.modulator](module);
    }
};

export default {
    enableMuteButton: enableMuteButton,
    createModule: createModule,
    createMasterModule: createMasterModule,
    connect: connect,
    disconnect: disconnect,
    destroyModule: destroyModule,
    refresh: refresh,
    parseModuleMessage: parseModuleMessage
};
