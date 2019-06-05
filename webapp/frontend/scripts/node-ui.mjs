/*jslint browser: true, maxlen: 80 */

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");
var nodeId = window.location.pathname.substr(1, 1);
var baseFreqSliderEl = document.getElementById("base-freq-slider");
var audioCtx = new window.AudioContext();

const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
var oscillatorGain = audioCtx.createGain();
oscillatorGain.connect(audioCtx.destination);
var oscillatorOffset = audioCtx.createConstantSource();
oscillatorOffset.connect(oscillatorGain);
oscillatorOffset.start();
var oscillator = audioCtx.createOscillator();
oscillator.start();
oscillator.connect(oscillatorGain);
oscillatorGain.connect(audioCtx.destination);

var showButtonEl = document.querySelector("button.show");
showButtonEl.onclick = function () {
    audioCtx.resume();
    selectedOscillatorFreq();
    selectedOscillatorType();
    selectedOscillatorGain();
    selectedOscillatorOffset();
};

var oscillatorAnalyser = audioCtx.createAnalyser();
oscillatorGain.connect(oscillatorAnalyser);
oscillatorAnalyser.fftSize = 32768;
var bufferLength = oscillatorAnalyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

const w = canvasEl.width;
const h = canvasEl.height;
var drawWaveForm = function () {
    window.requestAnimationFrame(drawWaveForm);
    oscillatorAnalyser.getByteTimeDomainData(dataArray);
    canvasCtx.clearRect(0, 0, w, h);

    var sliceWidth = w / bufferLength;
    var x = 0;

    canvasCtx.beginPath();
    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128;
        var y = h - v * h / 2;

        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.stroke();

//    analyser.getByteTimeDomainData(dataArray); // TODO: only when running
//    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
};

drawWaveForm();

var selectedModulator = function () {
    return document.querySelector("input[name=modulator]:checked").value;
};

var updateBaseFreq = function () {
    var baseFreqSlider = document.querySelector("#base-freq-slider").value;
    var baseFreq = Math.pow(2, baseFreqSlider); // Hz
    document.querySelector("#base-freq").textContent = baseFreq.toFixed(1);
};

var selectedBaseFreq = function () {
    var freq =
        parseFloat(document.querySelector("#base-freq").textContent); // Hz
    oscillator.frequency.value = freq;
    return freq;
};

var selectedOscillatorType = function () {
    var type =
        document.querySelector("input[name=oscillator-type]:checked").value;
    oscillator.type = type;
    return type;
};

var selectedOscillatorGain = function () {
    var gain = parseFloat(document.querySelector("#oscillator-gain").value);
    oscillatorGain.gain.value = gain;
    return gain;
};

var selectedOutputGain = function (i) {
    return parseFloat(document.querySelector("#output-gain").value);
};

var selectedOutputDelay = function (i) {
    return parseFloat(document.querySelector("#output-delay").value);
};

var selectedOscillatorOffset = function (i) {
    var offset = parseFloat(document.querySelector("#oscillator-offset").value);
    oscillatorOffset.offset.value = offset;
    return offset;
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
        sendSelection();
    })
);

baseFreqSliderEl.addEventListener("input", updateBaseFreq);

updateBaseFreq();
