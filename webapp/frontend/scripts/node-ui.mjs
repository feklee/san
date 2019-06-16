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
var sourceAmplitude = audioCtx.createGain();
var sourceOffset = audioCtx.createConstantSource();
var sourceGain = audioCtx.createGain();
var source = audioCtx.createOscillator();
var noiseSource = util.createNoiseSource(audioCtx);

noiseSource.start();
source.start();
source.connect(sourceAmplitude);
sourceAmplitude.connect(sourceGain);
sourceOffset.start();
sourceOffset.connect(sourceGain);

var controlEl = function (groupClass, nameClass, type) {
    var typeSelector = type !== "input" ? "." + type : type;
    return document.querySelector("." + groupClass + ".controls ." + nameClass +
                                  " " + typeSelector);
};

var nodes = [];

var selectedSourceFrequencyExp = function () {
    return parseFloat(controlEl("source", "frequency", "input").value);
};

var updateSourceFrequencyNumber = function () {
    var sourceFrequencyExp = selectedSourceFrequencyExp();
    var sourceFrequency = Math.pow(2, sourceFrequencyExp); // Hz
    controlEl("source", "frequency", "number").textContent =
        sourceFrequency.toFixed(2);
};

var selectedSourceFrequency = function () { // Hz
    updateSourceFrequencyNumber();
    return parseFloat(
        controlEl("source", "frequency", "number").textContent
    );
};

var setSourceFrequencyExp = function (value) {
    controlEl("source", "frequency", "input").value = value;
};

var selectedSourceType = function () {
    return document.querySelector("input[name=source-type]:checked").
        value;
};

var deselectAllRadioButtons = function (selectors) {
    document.querySelectorAll(selectors).forEach(function (el) {
        el.checked = false;
    });
};

var setSourceType = function (value) {
    deselectAllRadioButtons("input[name=source-type]");
    var el = document.querySelector("input[name=source-type][value=\"" +
                                    value + "\"]");
    if (el) {
        el.checked = true;
    }
};

var selectedSourceAmplitude = function () {
    return parseFloat(controlEl("source", "amplitude", "input").value);
};

var setSourceAmplitude = function (value) {
    controlEl("source", "amplitude", "input").value = value;
};

var selectedSourceDetuning = function () {
    return parseFloat(controlEl("source", "detuning", "input").value);
};

var setSourceDetuning = function (value) {
    controlEl("source", "detuning", "input").value = value;
};

var selectedSourceOffset = function () {
    return parseFloat(controlEl("source", "offset", "input").value);
};

var setSourceOffset = function (value) {
    controlEl("source", "offset", "input").value = value;
};

var connectNoiseSource = function () {
    source.disconnect();
    noiseSource.connect(sourceAmplitude);
};

var connectSourceOfType = function (type) {
    noiseSource.disconnect();
    source.connect(sourceAmplitude);
    source.type = type;
};

var updateSource = function () {
    sourceOffset.offset.value = selectedSourceOffset();
    sourceAmplitude.gain.value = selectedSourceAmplitude();
    var type = selectedSourceType();
    if (type === "noise") {
        connectNoiseSource();
    } else {
        connectSourceOfType(type);
    }
    source.frequency.value = selectedSourceFrequency();
};

var updateSourceNumbers = function () {
    updateSourceFrequencyNumber();
    controlEl("source", "detuning", "number").textContent =
        Math.round(controlEl("source", "detuning", "input").value);
    controlEl("source", "offset", "number").textContent =
        parseFloat(controlEl("source", "offset", "input").value).toFixed(2);
    controlEl("source", "amplitude", "number").textContent =
        parseFloat(controlEl("source", "amplitude", "input").value).
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

var sourceAnalyser = audioCtx.createAnalyser();
sourceGain.connect(sourceAnalyser);
sourceAnalyser.fftSize = 32768;
var bufferLength = sourceAnalyser.frequencyBinCount;
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

    sourceAnalyser.getByteTimeDomainData(dataArray);
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
        source: {
            type: selectedSourceType(),
            offset: selectedSourceOffset(),
            amplitude: selectedSourceAmplitude(),
            frequency: selectedSourceFrequency(),
            frequencyExp: selectedSourceFrequencyExp(),
            detuning: selectedSourceDetuning()
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

    setSourceType(message.source.type);
    setSourceFrequencyExp(message.source.frequencyExp);
    setSourceDetuning(message.source.detuning);
    setSourceOffset(message.source.offset);
    setSourceAmplitude(message.source.amplitude);
    updateSourceNumbers();
    updateSource();

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
        updateSource();
        sendSelection();
        resumeAudioCtx();
    })
);

document.querySelectorAll(".source.controls input").forEach(
    (el) => el.addEventListener("input", function () {
        updateSourceNumbers();
        updateSource();
    }));

document.querySelectorAll(".output.controls input").forEach(
    (el) => el.addEventListener("input", updateOutputNumbers));

updateSourceNumbers();
updateSource();

setInterval(removeExpiredNodes, graphUpdateInterval);
