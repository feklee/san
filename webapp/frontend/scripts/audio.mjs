/*jslint browser: true, maxlen: 80 */

var context;
var muteButtonEl;

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

var createNodeOscillator = function (node) {
    var o = context.createOscillator();
    o.connect(context.destination);
    o.start();
    node.oscillator = o;
};

var destroyNodeOscillator = function (node) {
    var o = node.oscillator;
    o.stop();
    o.disconnect();
};

export default {
    enableMuteButton: enableMuteButton,
    createNodeOscillator: createNodeOscillator,
    destroyNodeOscillator: destroyNodeOscillator
};
