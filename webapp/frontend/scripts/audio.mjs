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
    sourceModule.output.connect(destinationModule.input);
};

var createModule = {};

createModule.master = function (node) {
    var gain = context.createGain();
    gain.connect(context.destination);

    node.audioModule = {
        input: gain
    };
};

createModule.add = function (node) {
    var oscillator = context.createOscillator({frequency: 440});
    var gain = context.createGain();

    oscillator.connect(gain);
    oscillator.start();

    node.audioModule = {
        oscillator: oscillator,
        input: gain,
        output: gain
    };
};

createModule.multiply = function (node) {
    var oscillator = context.createOscillator({frequency: 440});
    var gain = context.createGain();

    oscillator.connect(gain);
    oscillator.start();

    // TODO: implement

    node.audioModule = {
        oscillator: oscillator,
        output: gain,
        input: gain
    };
};

var destroyModule = function (node) {
    var module = node.audioModule;
    module.oscillator.stop();
    module.oscillator.disconnect();
    module.gain.disconnect();
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
    replaceModule(node, message.moduleName);
};

export default {
    enableMuteButton: enableMuteButton,
    createDefaultModule: createModule.add,
    createMasterModule: createModule.master,
    connect: connect,
    destroyModule: destroyModule,
    refresh: refresh,
    parseModuleMessage: parseModuleMessage
};
