/*jslint browser: true, maxlen: 80 */

var context;
var muteButtonEl;
import visibleNodes from "./visible-nodes.mjs";

context = new window.AudioContext();
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
    muteButtonEl = document.querySelector("button.mute");
    muteButtonEl.onclick = toggleMute;
};

var createDefaultModule = function (node) {
    var module = {
        oscillator: context.createOscillator({frequency: 440}),
        gain: context.createGain()
    };

    module.oscillator.connect(module.gain);
    module.oscillator.start();
    module.gain.connect(context.destination);

    node.audioModule = module;
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

var addInput = function () {}; // TODO: implement

export default {
    enableMuteButton: enableMuteButton,
    createDefaultModule: createDefaultModule,
    addInput: addInput,
    destroyModule: destroyModule,
    refresh: refresh
};
