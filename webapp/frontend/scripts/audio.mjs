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

var createInternals = {};

createInternals.add = function (module) {
    module.inputGains.forEach(function (inputGain) {
        if (inputGain) {
            inputGain.connect(module.output);
        }
    });
};

createInternals.multiply = function (module) {
    var inputs = module.inputs;
    var connectedInputs = module.connectedInputs;
    var currentEnd;
    var i = 0;

    inputs.forEach(function (input) {
        var isFirstInput = (i === 0);
        var isLastInput = (i === inputs.size - 1);

        if (isFirstInput) {
            currentEnd = input;
        } else {
            var multiplier = context.createGain();
            multiplier.gain.value = 0;
            currentEnd.connect(multiplier);
            input.connect(multiplier.gain);
            currentEnd = multiplier;
            connectedInputs.add(multiplier); // TODO: rename connectedInputs to maybe internalConnections
        }

        if (isLastInput) {
            currentEnd.connect(module.output);
        }

        connectedInputs.add(input);

        i += 1;
    });
};

var removeInternals = function (module) {
    module.inputGains.forEach(function (inputGain) {
        inputGain.disconnect();
    });
    var connectedInputs = module.connectedInputs;
    connectedInputs.forEach(function (connectedInput) {
        connectedInput.disconnect();
        connectedInputs.delete(connectedInput);
    });
};

var connect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInputGain =
        destinationModule.inputGains[destinationPortNumber];
    console.log("connecting to port number" + destinationPortNumber);
    sourceModule.output.connect(destinationInputGain);
};

var disconnect = function (options) {
    var sourceModule = options.sourcePort.node.audioModule;
    var destinationPortNumber = options.destinationPort.portNumber;
    var destinationModule = options.destinationPort.node.audioModule;
    var destinationInputGain =
        destinationModule.inputGains[destinationPortNumber];
    try {
        sourceModule.output.disconnect(destinationInputGain);
    } catch (ignore) {}
};

var createMasterModule = function (node) {
    var inputGains = [
        null, // no oscillator
        context.createGain(), // port 1
    ];
    var connectedInputs = new Set();
    var m = {
        inputGains: inputGains,
        connectedInputs: connectedInputs,
        modulator: "add",
        output: context.destination
    };

    node.audioModule = m;

    createInternals[m.modulator](m);
};

var createModule = function (node) {
    var output = context.createGain();
    var baseFreq = 440;
    var oscillator = context.createOscillator({frequency: baseFreq});
    var connectedInputs = new Set();
    var inputGains = [
        context.createGain(), // oscillator
        context.createGain(), // port 1
        context.createGain(), // port 2
        context.createGain(), // ...
        context.createGain()
    ];

    oscillator.connect(inputGains[0]);
    oscillator.start();

    var m = {
        oscillator: oscillator,
        connectedInputs: connectedInputs,
        inputGains: inputGains,
        output: output,
        modulator: "add",
        oscType: "sine",
        baseFreq: baseFreq
    };
    node.audioModule = m;

    createInternals[m.modulator](m);
};

var destroyModule = function (node) {
    // TODO: remove all control modules, or simply all modules not connected to
    // directly or indirectly to the context

    var module = node.audioModule;
    module.oscillator.stop();
    module.oscillator.disconnect();
    delete module.oscillator;
    module.output.disconnect();
    delete module.output; // TODO: https://stackoverflow.com/q/56117520/282729
};

var refreshOscillator = function (node) {
    var m = node.audioModule;
    var o = m.oscillator;
    if (o.frequency.value !== m.baseFreq) {
        o.frequency.value = m.baseFreq;
    }
    o.detune.setValueAtTime(400 * node.animatedLocation.z, context.currentTime);
    if (o.type !== m.oscType) {
        o.type = m.oscType;
    }
};

var refresh = function () {
    visibleNodes.forEach(refreshOscillator);
};

var replaceModule = function (node, nameOfNewModule) {
    destroyModule(node);
    createModule[nameOfNewModule](node);
};

var setInputGains = function (inputGains) {
    console.log("hi");
    console.log(inputGains);
};

var parseModuleMessage = function (message) {
    var node = nodes[message.nodeId];
    var m = node.audioModule;
    m.baseFreq = message.baseFreq; // TODO: really change freq
    m.oscType = message.oscType;

    refreshOscillator(node);

    setInputGains(message.inputGains);

    if (m.modulator !== message.modulator) {
        m.modulator = message.modulator;
        removeInternals(m);
        createInternals[m.modulator](m);
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
