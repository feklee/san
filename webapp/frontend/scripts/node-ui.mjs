/*jslint browser: true, maxlen: 80 */

import client from "./web-socket-client.mjs";
var idOfThisNode = window.location.pathname.substr(1, 1);
var audioCtx = new window.AudioContext();
import util from "./util.mjs";
import nodeColors from "./node-colors.mjs";
import {
    graphUpdateInterval // ms
} from "./shared-settings.mjs";

var setUpHidpiCanvas = function (canvasEl) {
    var rect = canvasEl.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var dpr = window.devicePixelRatio || 1;
    canvasEl.width = w * dpr;
    canvasEl.height = h * dpr;
    canvasEl.style.width = w + "px";
    canvasEl.style.height = h + "px";
    var ctx = canvasEl.getContext("2d");
    ctx.lineWidth = dpr;
    return ctx;
};

const canvasEl = document.querySelector("canvas");
const canvasCtx = setUpHidpiCanvas(canvasEl);
var oscillatorGain = audioCtx.createGain();
var oscillatorOffset = audioCtx.createConstantSource();
oscillatorOffset.connect(oscillatorGain);
oscillatorOffset.start();
var oscillator = audioCtx.createOscillator();
oscillator.start();
oscillator.connect(oscillatorGain);


var controlEl = function (groupClass, nameClass, type) {
    var typeSelector = type !== "input" ? "." + type : type;
    return document.querySelector("." + groupClass + ".controls ." + nameClass +
                                  " " + typeSelector);
};

var nodes = [];

var selectedOscillatorFrequencyExp = function () {
    return parseFloat(controlEl("oscillator", "frequency", "input").value);
};

var updateOscillatorFrequencyNumber = function () {
    var oscillatorFrequencyExp = selectedOscillatorFrequencyExp();
    var oscillatorFrequency = Math.pow(2, oscillatorFrequencyExp); // Hz
    controlEl("oscillator", "frequency", "number").textContent =
        oscillatorFrequency.toFixed(2);
};

var selectedOscillatorFrequency = function () { // Hz
    updateOscillatorFrequencyNumber();
    return parseFloat(
        controlEl("oscillator", "frequency", "number").textContent
    );
};

var setOscillatorFrequencyExp = function (value) {
    controlEl("oscillator", "frequency", "input").value = value;
};

var selectedOscillatorType = function () {
    return document.querySelector("input[name=oscillator-type]:checked").value;
};

var deselectAllRadioButtons = function (selectors) {
    document.querySelectorAll(selectors).forEach(function (el) {
        el.checked = false;
    });
};

var setOscillatorType = function (value) {
    deselectAllRadioButtons("input[name=oscillator-type]");
    var el = document.querySelector("#oscillator-type-" + value);
    if (el) {
        el.checked = true;
    }
};

var selectedOscillatorGain = function () {
    return parseFloat(controlEl("oscillator", "gain", "input").value);
};

var setOscillatorGain = function (value) {
    controlEl("oscillator", "gain", "input").value = value;
};

var selectedOscillatorDetuning = function () {
    return parseFloat(controlEl("oscillator", "detuning", "input").value);
};

var setOscillatorDetuning = function (value) {
    controlEl("oscillator", "detuning", "input").value = value;
};

var selectedOscillatorOffset = function () {
    return parseFloat(controlEl("oscillator", "offset", "input").value);
};

var setOscillatorOffset = function (value) {
    controlEl("oscillator", "offset", "input").value = value;
};

var updateOscillator = function () {
    oscillatorOffset.offset.value = selectedOscillatorOffset();
    oscillatorGain.gain.value = selectedOscillatorGain();
    oscillator.type = selectedOscillatorType();
    oscillator.frequency.value = selectedOscillatorFrequency();
};

var updateOscillatorNumbers = function () {
    updateOscillatorFrequencyNumber();
    controlEl("oscillator", "detuning", "number").textContent =
        Math.round(controlEl("oscillator", "detuning", "input").value);
    controlEl("oscillator", "offset", "number").textContent =
        parseFloat(controlEl("oscillator", "offset", "input").value).toFixed(2);
    controlEl("oscillator", "gain", "number").textContent =
        Math.round(100 * controlEl("oscillator", "gain", "input").value);
};

var updateOutputNumbers = function () {
    controlEl("output", "delay", "number").textContent =
        parseFloat(controlEl("output", "delay", "input").value).toFixed(2);
    controlEl("output", "gain", "number").textContent =
        Math.round(100 * controlEl("output", "gain", "input").value);
};

var showGraph = function () {
    var hiddenGraphEl = document.querySelector(".hidden.graph");
    if (hiddenGraphEl) {
        hiddenGraphEl.classList.remove("hidden");
    }
};

var resumeAudioCtx = function () {
    if (audioCtx.state !== "running") {
        audioCtx.resume();
        showGraph();
    }
};

var showButtonEl = document.querySelector(".graph button.show");
showButtonEl.onclick = resumeAudioCtx;

var oscillatorAnalyser = audioCtx.createAnalyser();
oscillatorGain.connect(oscillatorAnalyser);
oscillatorAnalyser.fftSize = 32768;
var bufferLength = oscillatorAnalyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var drawZeroLine = function () {
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvasEl.height / 2);
    canvasCtx.lineTo(canvasEl.width, canvasEl.height / 2);
    canvasCtx.strokeStyle = "gray";
    canvasCtx.stroke();
};

var drawWaveForm = function () {
    window.requestAnimationFrame(drawWaveForm);

    if (audioCtx.state === "running") {
        showGraph();
    }

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

    canvasCtx.strokeStyle = "green";
    canvasCtx.stroke();
};

drawWaveForm();

var selectedModulator = function () {
    return document.querySelector("input[name=modulator]:checked").value;
};

var setModulator = function (value) {
    deselectAllRadioButtons("input[name=modulator]");
    var el = document.querySelector("#" + value + "-modulator");
    if (el) {
        el.checked = true;
    }
};

var selectedOutputGain = function () {
    return parseFloat(controlEl("output", "gain", "input").value);
};

var setOutputGain = function (value) {
    controlEl("output", "gain", "input").value = value;
};

var selectedOutputDelay = function () {
    return parseFloat(controlEl("output", "delay", "input").value);
};

var setOutputDelay = function (value) {
    controlEl("output", "delay", "input").value = value;
};

var selectedOutputCompressor = function () {
    return controlEl("output", "compressor", "input").checked;
};

var setOutputCompressor = function (value) {
    controlEl("output", "compressor", "input").checked = value;
};

var sendSelection = function () {
    var data = {
        type: "audio module",
        modulator: selectedModulator(),
        oscillator: {
            type: selectedOscillatorType(),
            offset: selectedOscillatorOffset(),
            gain: selectedOscillatorGain(),
            frequency: selectedOscillatorFrequency(),
            frequencyExp: selectedOscillatorFrequencyExp(),
            detuning: selectedOscillatorDetuning()
        },
        output: {
            gain: selectedOutputGain(),
            delay: selectedOutputDelay(),
            compressorShouldBeEnabled: selectedOutputCompressor()
        },
        nodeId: idOfThisNode
    };

    try {
        client.send(JSON.stringify(data));
        console.log(data); // TODO
    } catch (ignore) {
    }
};

var parseModuleMessage = function (message) {
    if (idOfThisNode !== message.nodeId) {
        return;
    }

    setOscillatorType(message.oscillator.type);
    setOscillatorFrequencyExp(message.oscillator.frequencyExp);
    setOscillatorDetuning(message.oscillator.detuning);
    setOscillatorOffset(message.oscillator.offset);
    setOscillatorGain(message.oscillator.gain);
    updateOscillatorNumbers();
    updateOscillator();

    setModulator(message.modulator);
    setOutputDelay(message.output.delay);
    setOutputCompressor(message.output.compressorShouldBeEnabled);
    setOutputGain(message.output.gain);
};

var nodeIconEl = function (className) {
    return document.querySelector("." + className + ".node-icon");
};

var setNodeIconColors = function (nodeEl, nodeId) {
    var colors = nodeColors(nodeId);
    nodeEl.style.background =
        "linear-gradient(to bottom right, " +
        colors[0] + " 0%, " +
        colors[0] + " 50%, " +
        colors[1] + " 50%, " +
        colors[1] + " 100%)";
};

var resetNodeExpiryTime = function (node) {
    node.expiryTime = util.connectionExpiryTime();
};

var nodeIsExpired = function (node) {
    return Date.now() > node.expiryTime;
};

var findNode = function (nodeId, type) {
    return nodes.find(function (node) {
        return node.id === nodeId && node.type === type;
    });
};

var createNodeIconEl = function (nodeId) {
    var el = document.createElement("li");
    el.classList.add("node-icon");
    setNodeIconColors(el, nodeId);
    return el;
};

var insertNodeIcon = function (node) {
    document.querySelector("ul." + node.type + ".nodes").
        appendChild(node.iconEl);
};

var removeNodeIcon = function (node) {
    document.querySelector("ul." + node.type + ".nodes").
        removeChild(node.iconEl);
};

var createNode = function (nodeId, type) {
    var node = {
        id: nodeId,
        type: type,
        iconEl: createNodeIconEl(nodeId)
    };
    resetNodeExpiryTime(node);
    insertNodeIcon(node);

    return node;
};

var addNode = function (nodeId, type) {
    nodes.push(createNode(nodeId, type));
};

var addOrResetNode = function (nodeId, type) {
    var foundNode = findNode(nodeId, type);
    if (foundNode) {
        resetNodeExpiryTime(foundNode);
    } else {
        addNode(nodeId, type);
    }
};

var deleteNode = function (node) {
    removeNodeIcon(node);
    var i = nodes.indexOf(node);
    nodes.splice(i, 1);
};

var removeExpiredNodes = function () {
    nodes.forEach(function (node) {
        if (nodeIsExpired(node)) {
            deleteNode(node);
        }
    });
};

var parseData = function (data) {
    var a = data.split("");
    var parentNodeId = a[0];
    var childNodeId = a[2];
    if (childNodeId === idOfThisNode) {
        addOrResetNode(parentNodeId, "output");
        return;
    }
    if (parentNodeId === idOfThisNode) {
        addOrResetNode(childNodeId, "input");
    }
};

client.onmessage = function (e) {
    var message;
    var json;
    if (typeof e.data === "string") {
        json = e.data;
        message = JSON.parse(json);
    } else {
        return;
    }

    switch (message.type) {
    case "data":
        parseData(message.text);
        break;
    case "audio module":
        parseModuleMessage(message);
        break;
    }
};

document.querySelectorAll("input").forEach(
    (el) => el.addEventListener("change", function () {
        updateOscillator();
        sendSelection();
        resumeAudioCtx();
    })
);

document.querySelectorAll(".oscillator.controls input").forEach(
    (el) => el.addEventListener("input", function () {
        updateOscillatorNumbers();
        updateOscillator();
    }));

document.querySelectorAll(".output.controls input").forEach(
    (el) => el.addEventListener("input", updateOutputNumbers));

updateOscillatorNumbers();
updateOscillator();

setNodeIconColors(document.querySelector(".this.node-icon"), idOfThisNode);

setInterval(removeExpiredNodes, graphUpdateInterval);
