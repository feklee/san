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
    module.inputGains.forEach(function (inputGain) {
        if (inputGain) {
            inputGain.connect(module.outputInternal);
        }
    });
};

connectInternalAudioNodes.multiply = function (module) {
    var inputGains = module.inputGains;
    var internalAudioNodes = module.internalAudioNodes;
    var lastAudioNode;

    inputGains.forEach(function (inputGain) {
        if (!inputGain) {
            return;
        }

        if (lastAudioNode === undefined) {
            lastAudioNode = inputGain;
            return;
        }

        var multiplier = context.createGain();
        internalAudioNodes.add(multiplier);
        multiplier.gain.value = 0;
        inputGain.connect(multiplier.gain);
        lastAudioNode.connect(multiplier);

        lastAudioNode = multiplier;
    });

    lastAudioNode.connect(module.outputInternal);
};

var disconnectInternalAudioNodes = function (module) {
    module.inputGains.forEach(function (inputGain) {
        if (inputGain) {
            inputGain.disconnect();
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

var createInputGain = function (module, portNumber) {
    var inputGain = context.createGain();
    var inputOffset = module.inputOffsets[portNumber];
    if (inputOffset) {
        inputOffset.connect(inputGain);
    }
    module.inputGains[portNumber] = inputGain;
    return inputGain;
};

var connect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInputGain =
            createInputGain(destinationModule, destinationPortNumber);
    sourceModule.output.connect(destinationInputGain);

    reconnectInternalAudioNodes(destinationModule);
};

var destroyInputGain = function (module, portNumber) {
    var inputGain = module.inputGains[portNumber];
    if (inputGain === null) {
        return;
    }
    var inputOffset = module.inputOffsets[portNumber];
    if (inputOffset) {
        inputOffset.disconnect(inputGain);
    }
    module.inputGains[portNumber] = null;
};

var disconnect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInputGain =
            destinationModule.inputGains[destinationPortNumber];
    var sourceOutput = sourceModule.output;
    if (!destinationInputGain) {
        return;
    }
    if (sourceOutput.numberOfOutputs > 0) {
        try {
            sourceOutput.disconnect(destinationInputGain);
        } catch (ignore) {} // may not be needed, but doesn't hurt
    }
    destroyInputGain(destinationModule, destinationPortNumber);

    reconnectInternalAudioNodes(destinationModule);
};

var createMasterModule = function (node) {
    var inputGains = [
        null, // no oscillator
        context.createGain() // port 1
    ];
    var inputOffsets = [
        null,
        null
    ];
    var internalAudioNodes = new Set();
    var module = {
        inputGains: inputGains,
        inputOffsets: inputOffsets,
        internalAudioNodes: internalAudioNodes,
        modulator: "add",
        outputInternal: context.destination
    };

    node.audioModule = module;

    connectInternalAudioNodes[module.modulator](module);
};

var setInputOffsets = function (module, valuesForInputOffsets) {
    valuesForInputOffsets.forEach(function (value, i) {
        var inputOffset = module.inputOffsets[i];
        if (inputOffset) {
            inputOffset.offset.value = value;
        }
    });
};

var createModule = function (node) {
    var outputGain = context.createGain();
    const maxDelayTime = 1; // seconds
    var outputDelay = context.createDelay(maxDelayTime);
    var baseFreq = 440;
    var oscillator = context.createOscillator({frequency: baseFreq});
    var internalAudioNodes = new Set();
    var oscillatorGain = context.createGain();
    var inputGains = [
        oscillatorGain,
        null, // port 1
        null, // port 2
        null, // ...
        null
    ];
    var inputOffsets = [
        context.createConstantSource(),
        context.createConstantSource(),
        context.createConstantSource(),
        context.createConstantSource(),
        context.createConstantSource()
    ];
    var oscillatorOffset = inputOffsets[0];

    oscillator.connect(inputGains[0]);
    oscillator.start();

    inputOffsets.forEach(function (inputOffset) {
        inputOffset.start();
    });

    oscillatorOffset.connect(inputGains[0]);

    outputDelay.connect(outputGain);

    var module = {
        oscillator: oscillator,
        oscillatorGain: oscillatorGain,
        internalAudioNodes: internalAudioNodes,
        inputGains: inputGains,
        inputOffsets: inputOffsets,
        outputDelay: outputDelay,
        outputGain: outputGain,
        output: outputGain,
        outputInternal: outputDelay,
        modulator: "add",
        oscType: "sine",
        baseFreq: baseFreq
    };
    node.audioModule = module;

    setInputOffsets(module, [0, 0, 0, 0, 0]);

    connectInternalAudioNodes[module.modulator](module);
};

var destroyModule = function (node) {
    var module = node.audioModule;
    disconnectInternalAudioNodes(module);
    module.oscillator.stop();
    module.inputOffsets.forEach(function (inputOffset) {
        if (inputOffset) {
            inputOffset.disconnect();
            inputOffset.stop();
        }
    });
};

var refreshOscillator = function (node) {
    var module = node.audioModule;
    var o = module.oscillator;
    if (o.frequency.value !== module.baseFreq) {
        o.frequency.value = module.baseFreq;
    }
    o.detune.setValueAtTime(400 * node.animatedLocation.z, context.currentTime);
    if (o.type !== module.oscType) {
        o.type = module.oscType;
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
    module.oscType = message.oscType;

    setOscillatorGain(module, message.oscillatorGain);
    setInputOffsets(module, message.inputOffsets);
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
