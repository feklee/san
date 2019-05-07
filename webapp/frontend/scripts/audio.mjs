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

var connect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.add(sourceModule.output);
    destinationModule.refreshConnections();
};

var disconnect = function (options) {
    var sourceModule = options.source.audioModule;
    var destinationModule = options.destination.audioModule;
    destinationModule.inputs.delete(sourceModule.output);
    destinationModule.refreshConnections();
};

var refreshConnections = {};

refreshConnections.add = function (output, inputs, connectedInputs) {
    connectedInputs.forEach(function (input) {
        input.disconnect();
        connectedInputs.delete(input);
    });
    inputs.forEach(function (input) {
        input.connect(output);
        connectedInputs.add(input);
    });
};

var createModule = {};

createModule.master = function (node) {
    var inputs = new Set();
    var connectedInputs = new Set();

    node.audioModule = {
        inputs: inputs,
        connectedInputs: connectedInputs,
        refreshConnections: function () {
            refreshConnections.add(
                context.destination,
                inputs,
                connectedInputs
            );
        },
        name: "master"
    };

    node.audioModule.refreshConnections();
};

createModule.add = function (node) {
    var oscillator = context.createOscillator({frequency: 440});
    var output = context.createGain();
    var inputs = new Set();
    var connectedInputs = new Set();

    oscillator.start();
    inputs.add(oscillator);

    refreshConnections();

    node.audioModule = {
        oscillator: oscillator,
        connectedInputs: connectedInputs,
        inputs: inputs,
        output: output,
        name: "add" // TODO: add `parameters`, e.g. gain for each individual input, or wave form
    };
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
    var o = node.audioModule.oscillator;
    o.detune.setValueAtTime(400 * node.animatedLocation.z, context.currentTime);
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
    var moduleName = message.moduleName;
    replaceModule(node, message.moduleName);
    var module = node.audioModule;
    module.refreshConnections = refreshConnections[moduleName];
    module.refreshConnections();
};

export default {
    enableMuteButton: enableMuteButton,
    createDefaultModule: createModule.add,
    createMasterModule: createModule.master,
    connect: connect,
    disconnect: disconnect,
    destroyModule: destroyModule,
    refresh: refresh,
    parseModuleMessage: parseModuleMessage
};
