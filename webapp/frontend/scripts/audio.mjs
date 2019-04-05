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
    var o = context.createOscillator({frequency: 432});
    o.connect(context.destination);
    o.start();
    node.oscillator = o;
};

var destroyModule = function (node) {
    var o = node.oscillator;
    o.stop();
    o.disconnect();
};

var refreshOscillator = function (node) {
    var o = node.oscillator;
    o.detune.setValueAtTime(400 * node.animatedLocation.z, context.currentTime);
};

var refresh = function () {
    visibleNodes.forEach(refreshOscillator);
};

export default {
    enableMuteButton: enableMuteButton,
    createDefaultModule: createDefaultModule,
    destroyModule: destroyModule,
    refresh: refresh
};
