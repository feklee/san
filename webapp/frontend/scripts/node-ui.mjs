/*jslint browser: true, maxlen: 80 */

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");
var nodeId = window.location.pathname.substr(1, 1);
var baseFreqSliderEl = document.getElementById("base-freq-slider");

var selectedModulator = function () {
    return document.querySelector("input[name=modulator]:checked").value;
};

var updateBaseFreq = function () {
    var baseFreqSlider = document.querySelector("#base-freq-slider").value;
    var baseFreq = Math.pow(2, baseFreqSlider); // Hz
    document.querySelector("#base-freq").textContent = baseFreq.toFixed(1);
};

var selectedBaseFreq = function () {
    return parseFloat(document.querySelector("#base-freq").textContent);
};

var selectedOscType = function () {
    return document.querySelector("input[name=osc-type]:checked").value;
};

var selectedOscillatorGain = function () {
    return parseFloat(document.querySelector("#oscillator-gain").value);
};

var selectedOutputGain = function (i) {
    return parseFloat(document.querySelector("#output-gain").value);
};

var selectedOutputDelay = function (i) {
    return parseFloat(document.querySelector("#output-delay").value);
};

var selectedOscillatorOffset = function (i) {
    return parseFloat(document.querySelector("#oscillator-offset").value);
};

var sendSelection = function () {
    var data = {
        type: "audio module",
        modulator: selectedModulator(),
        outputGain: selectedOutputGain(),
        outputDelay: selectedOutputDelay(),
        oscType: selectedOscType(),
        oscillatorOffset: selectedOscillatorOffset(),
        oscillatorGain: selectedOscillatorGain(),
        baseFreq: selectedBaseFreq(),
        nodeId: nodeId
    };
    console.log(JSON.stringify(data));

    try {
        client.send(JSON.stringify(data));
    } catch (ignore) {
    }
};

client.onerror = function () {
    console.log("WebSocket error");
};

client.onopen = function () {
    console.log("WebSocket opened");
    sendSelection();
};

client.onclose = function () {
    console.log("WebSocket closed");
};

var radioButtonEl = function (moduleName) {
    return document.querySelector("#" + moduleName + "-module");
};

document.querySelectorAll("input").forEach(
    (el) => el.addEventListener("change", function () {
        sendSelection();
    })
);

baseFreqSliderEl.addEventListener("input", updateBaseFreq);

updateBaseFreq();
