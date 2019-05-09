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
    var baseFreq =
        440 * Math.exp(10 * (baseFreqSlider - 0.7)); // Hz
    document.querySelector("#base-freq").textContent = baseFreq.toFixed(1);
};

var selectedBaseFreq = function () {
    // return baseFreq;
};

var sendSelectedModule = function () {
    var data = {
        type: "audio module",
        modulator: selectedModulator(),
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
    sendSelectedModule();
};

client.onclose = function () {
    console.log("WebSocket closed");
};

var radioButtonEl = function (moduleName) {
    return document.querySelector("#" + moduleName + "-module");
};

var selectModule = function (moduleName) {
    radioButtonEl("sine").checked = true;
};

document.querySelectorAll("input[name=modulator]").forEach(
    (el) => el.addEventListener("click", sendSelectedModule)
);

document.querySelectorAll("input").forEach(
    (el) => el.addEventListener("change", function () {
        console.log("change of any el: send data");
    })
);

baseFreqSliderEl.addEventListener("input", updateBaseFreq);

updateBaseFreq();

selectModule("sine");
