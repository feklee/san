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

var refreshConnections = function (module) {
    var connectedInputs = module.connectedInputs;
    var inputs = module.inputs;
    var output = module.output;
    connectedInputs.forEach(function (input) {
        input.disconnect();
        connectedInputs.delete(input);
    });
    inputs.forEach(function (input) {
        input.connect(output);
        connectedInputs.add(input);
    });
};

var connect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.add(sourceModule.output);
    refreshConnections(destinationModule);
};

var disconnect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.delete(sourceModule.output);
    destinationModule.refreshConnections();
};

var createMasterModule = function (node) {
    var inputs = new Set();
    var connectedInputs = new Set();

    node.audioModule = {
        output: context.destination,
        inputs: inputs,
        connectedInputs: connectedInputs,
        name: "master"
    };

    refreshConnections(node.audioModule);
};

var createModule = function (node) {
    var baseFreq = 440;
    var oscillator = context.createOscillator({frequency: baseFreq});
    var output = context.createGain();
    var inputs = new Set();
    var connectedInputs = new Set();

    oscillator.start();
    inputs.add(oscillator);

    node.audioModule = {
        oscillator: oscillator,
        connectedInputs: connectedInputs,
        inputs: inputs,
        output: output,
        modulator: "add",
        inputGains: [1, 1, 1, 1],
        oscType: "sine",
        baseFreq: baseFreq
    };

    refreshConnections(node.audioModule);

    // TODO, multiplication: multiply gains, connect first signal to input, the
    // other one to gain (see question on StackOverflow)

    // TODO, addition: create gain 
};

var update = function (node, parameters) {
    var module = node.audioModule;
    // TODO: only rewire on change of module
    
};

createModule.multiply = function (node) {
/*    var oscillator = context.createOscillator({frequency: 440});
    var gain = context.createGain();

    oscillator.connect(gain);
    oscillator.start();

    // TODO: implement

    node.audioModule = {
        oscillator: oscillator,
        output: gain,
        input: gain
    };*/
};

var destroyModule = function (node) {
    // TODO: remove all control modules, or simply all modules not connected to
    // directly or indirectly to the context

    var module = node.audioModule;
    module.oscillator.stop();
    module.oscillator.disconnect();
    delete module.oscillator;
    module.output.disconnect();
    delete module.output;
    // TODO: remove modules (check w/ web audio debugger in FF)
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
    m.modulator = message.modulator;
    m.baseFreq = message.baseFreq; // TODO: really change freq
    m.oscType = message.oscType;

    refreshOscillator(node);
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
