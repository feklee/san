/*jslint browser: true, maxlen: 80 */

var context;
var muteButtonEl;

var setup = function () {
    context = new window.AudioContext();

    var oscillator = context.createOscillator();
    oscillator.connect(context.destination);
    oscillator.start();
};

var toggleMute = function () {
    if (context === undefined) {
        setup();
        muteButtonEl.textContent = "🔊";
        return;
    }
    if (context.state === "suspended") {
        context.resume();
        muteButtonEl.textContent = "🔊";
    } else {
        context.suspend();
        muteButtonEl.textContent = "🔇";
    }
};

var enableMuteButton = function () {
    muteButtonEl = document.querySelector("button.mute");
    muteButtonEl.onclick = toggleMute;
};

export default {
    enableMuteButton: enableMuteButton
};
