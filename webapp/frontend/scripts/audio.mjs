/*jslint browser: true, maxlen: 80 */

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
    sourceModule.gain.connect(destinationModule.gain);
};

var createMasterModule = function (node) {
    var gain = context.createGain();
    gain.connect(context.destination);

    node.audioModule = {
        gain: gain
    };
};

var createDefaultModule = function (node) {
    var oscillator = context.createOscillator({frequency: 440});
    var gain = context.createGain();

    oscillator.connect(gain);
    oscillator.start();

    node.audioModule = {
        oscillator: oscillator,
        gain: gain
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

export default {
    enableMuteButton: enableMuteButton,
    createDefaultModule: createDefaultModule,
    createMasterModule: createMasterModule,
    connect: connect,
    destroyModule: destroyModule,
    refresh: refresh
};
