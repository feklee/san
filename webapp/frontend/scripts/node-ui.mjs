/*jslint browser: true, maxlen: 80 */

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");
var nodeId = window.location.pathname.substr(1, 1);
var baseFreqSliderEl = document.getElementById("base-freq-slider");
var audioCtx = new window.AudioContext();

const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
var oscillatorGain = audioCtx.createGain();
var oscillatorOffset = audioCtx.createConstantSource();
oscillatorOffset.connect(oscillatorGain);
oscillatorOffset.start();
var oscillator = audioCtx.createOscillator();
oscillator.start();
oscillator.connect(oscillatorGain);

var updateBaseFreq = function () {
    var baseFreqSlider = document.querySelector("#base-freq-slider").value;
    var baseFreq = Math.pow(2, baseFreqSlider); // Hz
    document.querySelector("#base-freq").textContent = baseFreq.toFixed(1);
};

var selectedBaseFreq = function () { // Hz
    updateBaseFreq();
    return parseFloat(document.querySelector("#base-freq").textContent);
};

var selectedOscillatorType = function () {
    return document.querySelector("input[name=oscillator-type]:checked").value;
};

var selectedOscillatorGain = function () {
    return parseFloat(document.querySelector("#oscillator-gain").value);
};

var selectedOscillatorOffset = function (i) {
    return parseFloat(document.querySelector("#oscillator-offset").value);
};

var updateOscillator = function () {
    oscillatorOffset.offset.value = selectedOscillatorOffset();
    oscillatorGain.gain.value = selectedOscillatorGain();
    oscillator.type = selectedOscillatorType();
    oscillator.frequency.value = selectedBaseFreq();
};

var showGraph = function () {
    if (audioCtx.state !== "running") {
        updateOscillator();
        audioCtx.resume();
        document.querySelector(".hidden.graph").classList.remove("hidden");
    }
};

var showButtonEl = document.querySelector(".graph button.show");
showButtonEl.onclick = showGraph;

var oscillatorAnalyser = audioCtx.createAnalyser();
oscillatorGain.connect(oscillatorAnalyser);
oscillatorAnalyser.fftSize = 32768;
var bufferLength = oscillatorAnalyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var drawZeroLine = function () {
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvasEl.height / 2);
    canvasCtx.lineTo(canvasEl.width, canvasEl.height / 2);
    canvasCtx.strokeStyle = "#55f";
    canvasCtx.stroke();
};

var drawWaveForm = function () {
    window.requestAnimationFrame(drawWaveForm);

    const w = canvasEl.width;
    const h = canvasEl.height;

    oscillatorAnalyser.getByteTimeDomainData(dataArray);
    canvasCtx.clearRect(0, 0, w, h);

    var sliceWidth = w / bufferLength;
    var x = 0;

    drawZeroLine();

    canvasCtx.beginPath();
    dataArray.forEach(function (value, i) {
        var v = value / 128;
        var y = h - v * h / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    });

    canvasCtx.strokeStyle = "white";
    canvasCtx.stroke();
};

drawWaveForm();

var selectedModulator = function () {
    return document.querySelector("input[name=modulator]:checked").value;
};

var selectedOutputGain = function (i) {
    return parseFloat(document.querySelector("#output-gain").value);
};

var selectedOutputDelay = function (i) {
    return parseFloat(document.querySelector("#output-delay").value);
};

var selectedOscillatorDetuningFactor = function () {
    return parseFloat(
        document.querySelector("#oscillator-detuning-factor").value
    );
};

var selectedOutputCompressor = function () {
    return document.querySelector("#output-compressor").checked;
};

var sendSelection = function () {
    var data = {
        type: "audio module",
        modulator: selectedModulator(),
        outputGain: selectedOutputGain(),
        outputDelay: selectedOutputDelay(),
        outputCompressorShouldBeEnabled: selectedOutputCompressor(),
        oscillatorType: selectedOscillatorType(),
        oscillatorOffset: selectedOscillatorOffset(),
        oscillatorGain: selectedOscillatorGain(),
        baseFreq: selectedBaseFreq(),
        oscillatorDetuningFactor: selectedOscillatorDetuningFactor(),
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
        updateOscillator();
        sendSelection();
        showGraph();
    })
);

baseFreqSliderEl.addEventListener("input", updateBaseFreq);

updateBaseFreq();
