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
    var inputs = module.inputs;
    var connectedInputs = module.connectedInputs;
    inputs.forEach(function (input) {
        input.connect(module.output);
        connectedInputs.add(input);
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
    var connectedInputs = module.connectedInputs;
    connectedInputs.forEach(function (connectedInput) {
        connectedInput.disconnect();
        connectedInputs.delete(connectedInput);
    });
};

var connect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.add(sourceModule.output);
    removeInternals(destinationModule); // TODO: maybe only add the new one instead of rebuilding all
    createInternals[destinationModule.modulator](destinationModule);
};

var disconnect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.delete(sourceModule.output);
    removeInternals(destinationModule); // TODO: maybe just remove what isn't needed instead of rebuilding all
    createInternals[destinationModule.modulator](destinationModule);
};

var createMasterModule = function (node) {
    var inputs = new Set();
    var connectedInputs = new Set();
    var m = {
        inputs: inputs,
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
    var inputs = new Set();
    var connectedInputs = new Set();

    oscillator.start();
    inputs.add(oscillator);

    var m = {
        oscillator: oscillator,
        connectedInputs: connectedInputs,
        inputs: inputs,
        output: output,
        modulator: "add",
        inputGains: [1, 1, 1, 1],
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

var parseModuleMessage = function (message) {
    var node = nodes[message.nodeId];
    var m = node.audioModule;
    m.baseFreq = message.baseFreq; // TODO: really change freq
    m.oscType = message.oscType;

    refreshOscillator(node);

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
