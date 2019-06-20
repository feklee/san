/*jslint browser: true, maxlen: 80 */

import client from "./web-socket-client.mjs";
import util from "./util.mjs";
import nodeColors from "./node-colors.mjs";
import {
    graphUpdateInterval // ms
} from "./shared-settings.mjs";

var idOfThisNode = window.location.pathname.substr(1, 1);
var audioCtx = new window.AudioContext();

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
var generatorAmplitude = audioCtx.createGain();
var generatorOffset = audioCtx.createConstantSource();
var generatorGain = audioCtx.createGain();
var oscillator = audioCtx.createOscillator();
var unfilteredNoise = util.createNoiseGenerator(audioCtx);
var noiseBandpass = audioCtx.createBiquadFilter();
noiseBandpass.type = "bandpass";
var noise = noiseBandpass;
var generatorInput = generatorAmplitude;
var generator;

unfilteredNoise.start();
unfilteredNoise.connect(noiseBandpass);
oscillator.start();
generatorAmplitude.connect(generatorGain);
generatorOffset.start();
generatorOffset.connect(generatorGain);

var setGenerator = function (newGenerator) {
    if (generator === newGenerator) {
        return;
    }
    if (generator) {
        generator.disconnect();
    }
    generator = newGenerator;
    generator.connect(generatorInput);
};

setGenerator(oscillator);

var controlEl = function (groupClass, nameClass, type) {
    var typeSelector = type !== "input" ? "." + type : type;
    return document.querySelector("." + groupClass + ".controls ." + nameClass +
                                  " " + typeSelector);
};

var nodes = [];

var selectedGeneratorFrequencyExp = function () {
    return parseFloat(controlEl("generator", "frequency", "input").value);
};

var updateGeneratorFrequencyNumber = function () {
    var generatorFrequencyExp = selectedGeneratorFrequencyExp();
    var generatorFrequency = Math.pow(2, generatorFrequencyExp); // Hz
    controlEl("generator", "frequency", "number").textContent =
        generatorFrequency.toFixed(2);
};

var selectedGeneratorFrequency = function () { // Hz
    updateGeneratorFrequencyNumber();
    return parseFloat(
        controlEl("generator", "frequency", "number").textContent
    );
};

var setGeneratorFrequencyExp = function (value) {
    controlEl("generator", "frequency", "input").value = value;
};

var selectedGeneratorType = function () {
    return document.querySelector("input[name=generator-type]:checked").
        value;
};

var deselectAllRadioButtons = function (selectors) {
    document.querySelectorAll(selectors).forEach(function (el) {
        el.checked = false;
    });
};

var setGeneratorType = function (value) {
    deselectAllRadioButtons("input[name=generator-type]");
    var el = document.querySelector("input[name=generator-type][value=\"" +
                                    value + "\"]");
    if (el) {
        el.checked = true;
    }
};

var selectedGeneratorAmplitude = function () {
    return parseFloat(controlEl("generator", "amplitude", "input").value);
};

var setGeneratorAmplitude = function (value) {
    controlEl("generator", "amplitude", "input").value = value;
};

var selectedGeneratorDetuning = function () {
    return parseFloat(controlEl("generator", "detuning", "input").value);
};

var setGeneratorDetuning = function (value) {
    controlEl("generator", "detuning", "input").value = value;
};

var selectedGeneratorOffset = function () {
    return parseFloat(controlEl("generator", "offset", "input").value);
};

var setGeneratorOffset = function (value) {
    controlEl("generator", "offset", "input").value = value;
};

var updateGenerator = function () {
    generatorOffset.offset.value = selectedGeneratorOffset();
    generatorAmplitude.gain.value = selectedGeneratorAmplitude();
    var type = selectedGeneratorType();
    if (type === "noise") {
        setGenerator(noise);
    } else {
        setGenerator(oscillator);
        oscillator.type = type;
    }
    generator.frequency.value = selectedGeneratorFrequency();
};

var updateGeneratorNumbers = function () {
    updateGeneratorFrequencyNumber();
    controlEl("generator", "detuning", "number").textContent =
        Math.round(controlEl("generator", "detuning", "input").value);
    controlEl("generator", "offset", "number").textContent =
        parseFloat(controlEl("generator", "offset", "input").value).toFixed(2);
    controlEl("generator", "amplitude", "number").textContent =
        parseFloat(controlEl("generator", "amplitude", "input").value).
        toFixed(2);
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

var generatorAnalyser = audioCtx.createAnalyser();
generatorGain.connect(generatorAnalyser);
generatorAnalyser.fftSize = 32768;
var bufferLength = generatorAnalyser.frequencyBinCount;
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

    generatorAnalyser.getByteTimeDomainData(dataArray);
    canvasCtx.clearRect(0, 0, w, h);

    var sliceWidth = w / bufferLength;
    var x = 0;

    canvasCtx.lineWidth = "0.8";

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

var setModulator = function (value) {
    deselectAllRadioButtons("input[name=modulator]");
    var el = document.querySelector("input[name=modulator][value=\"" + value +
                                    "\"]");
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
        generator: {
            type: selectedGeneratorType(),
            offset: selectedGeneratorOffset(),
            amplitude: selectedGeneratorAmplitude(),
            frequency: selectedGeneratorFrequency(),
            frequencyExp: selectedGeneratorFrequencyExp(),
            detuning: selectedGeneratorDetuning()
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

    setGeneratorType(message.generator.type);
    setGeneratorFrequencyExp(message.generator.frequencyExp);
    setGeneratorDetuning(message.generator.detuning);
    setGeneratorOffset(message.generator.offset);
    setGeneratorAmplitude(message.generator.amplitude);
    updateGeneratorNumbers();
    updateGenerator();

    setModulator(message.modulator);

    setOutputDelay(message.output.delay);
    setOutputCompressor(message.output.compressorShouldBeEnabled);
    setOutputGain(message.output.gain);
    updateOutputNumbers();
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

var setNodeIconLink = function (nodeEl, nodeId) {
    if (!util.nodeIsRootNode(nodeId)) {
        nodeEl.querySelector("a").href = nodeId;
    }
};

var setNodeIcon = function (nodeEl, nodeId) {
    setNodeIconColors(nodeEl, nodeId);
    setNodeIconLink(nodeEl, nodeId);
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
    if (util.nodeIsRootNode(nodeId)) {
        el.classList.add("root");
    }

    if (nodeId === idOfThisNode) {
        el.classList.add("this");
    }

    if (!util.nodeIsRootNode(nodeId)) {
        var linkEl = document.createElement("a");
        el.appendChild(linkEl);
    }

    setNodeIcon(el, nodeId);
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

    addOrResetNode(parentNodeId, "all");
    addOrResetNode(childNodeId, "all");

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
        updateGenerator();
        sendSelection();
        resumeAudioCtx();
    })
);

document.querySelectorAll(".generator.controls input").forEach(
    (el) => el.addEventListener("input", function () {
        updateGeneratorNumbers();
        updateGenerator();
    }));

document.querySelectorAll(".output.controls input").forEach(
    (el) => el.addEventListener("input", updateOutputNumbers));

updateGeneratorNumbers();
updateGenerator();
updateOutputNumbers();

setInterval(removeExpiredNodes, graphUpdateInterval);
