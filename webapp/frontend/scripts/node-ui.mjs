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

var oscillatorControlEls = {
    frequency: {
        input: document.querySelector(".oscillator.controls .frequency input"),
        number:
        document.querySelector(".oscillator.controls .frequency .number")
    },
    gain: {
        input: document.querySelector(".oscillator.controls .gain input")
    },
    detuning: {
        input: document.querySelector(".oscillator.controls .detuning input")
    },
    offset: {
        input: document.querySelector(".oscillator.controls .offset input")
    }
};

var outputControlEls = {
    gain: {
        input: document.querySelector(".output.controls .gain input")
    },
    delay: {
        input: document.querySelector(".output.controls .delay input")
    },
    compressor: {
        input: document.querySelector(".output.controls .compressor input")
    }
};

var allIconClassNames = ["this", "parent", "child-1", "child-2", "child-3"];
var childNodeIconClassNames = ["child-1", "child-2", "child-3"];
var nodeIconIds = {};
var nodeIconExpiryTimes = {};

var selectedOscillatorFrequencyExp = function () {
    return parseFloat(oscillatorControlEls.frequency.input.value);
};

var updateOscillatorFrequency = function () {
    var oscillatorFrequencyExp = selectedOscillatorFrequencyExp();
    var oscillatorFrequency = Math.pow(2, oscillatorFrequencyExp); // Hz
    oscillatorControlEls.frequency.number.textContent = oscillatorFrequency.toFixed(2);
};

var selectedOscillatorFrequency = function () { // Hz
    updateOscillatorFrequency();
    return parseFloat(oscillatorControlEls.frequency.number.textContent);
};

var setOscillatorFrequencyExp = function (value) {
    oscillatorControlEls.frequency.input.value = value;
    updateOscillatorFrequency();
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
    return parseFloat(oscillatorControlEls.gain.input.value);
};

var setOscillatorGain = function (value) {
    oscillatorControlEls.gain.input.value = value;
};

var selectedOscillatorDetuning = function () {
    return parseFloat(oscillatorControlEls.detuning.input.value);
};

var setOscillatorDetuning = function (value) {
    oscillatorControlEls.detuning.input.value = value;
};

var selectedOscillatorOffset = function () {
    return parseFloat(oscillatorControlEls.offset.input.value);
};

var setOscillatorOffset = function (value) {
    oscillatorControlEls.offset.input.value = value;
};

var updateOscillator = function () {
    oscillatorOffset.offset.value = selectedOscillatorOffset();
    oscillatorGain.gain.value = selectedOscillatorGain();
    oscillator.type = selectedOscillatorType();
    oscillator.frequency.value = selectedOscillatorFrequency();
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
    return parseFloat(outputControlEls.gain.input.value);
};

var setOutputGain = function (value) {
    outputControlEls.gain.input.value = value;
};

var selectedOutputDelay = function () {
    return parseFloat(outputControlEls.delay.input.value);
};

var setOutputDelay = function (value) {
    outputControlEls.delay.input.value = value;
};

var selectedOutputCompressor = function () {
    return outputControlEls.compressor.input.checked;
};

var setOutputCompressor = function (value) {
    outputControlEls.compressor.input.checked = value;
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
    updateOscillator();

    setModulator(message.modulator);
    setOutputDelay(message.output.delay);
    setOutputCompressor(message.output.compressorShouldBeEnabled);
    setOutputGain(message.output.gain);
};

var nodeIconEl = function (className) {
    return document.querySelector("." + className + ".node-icon");
};

var resetNodeIconExpiryTime = function (className) {
    nodeIconExpiryTimes[className] = util.connectionExpiryTime();
};

var setNodeIcon = function (className, nodeId) {
    var colors = nodeColors(nodeId);
    var el = nodeIconEl(className);
    return; // TODO
    el.classList.remove("not-set");
    el.style.background =
            "linear-gradient(to bottom right, " +
            colors[0] + " 0%, " +
            colors[0] + " 50%, " +
            colors[1] + " 50%, " +
            colors[1] + " 100%)";
    resetNodeIconExpiryTime(className);
    nodeIconIds[className] = nodeId;
};

var nodeIconIsExpired = function (className) {
    var expiryTime = nodeIconExpiryTimes[className];
    return expiryTime === undefined
        ? true
        : Date.now() > expiryTime;
};

var unsetNodeIconIfExpired = function (className) {
    if (nodeIconIsExpired(className)) {
        var el = nodeIconEl(className);
        if (el) {
            el.classList.add("not-set");
            el.style.removeProperty("background");
        }
        delete nodeIconIds[className];
    }
};

var unsetExpiredNodeIcons = function () {
    resetNodeIconExpiryTime("this"); // never expire icon of current node
    allIconClassNames.forEach(
        unsetNodeIconIfExpired
    );
};

var classNameOfChildNodeIcon = function (childNodeId) {
    return childNodeIconClassNames.find(function (className) {
        return nodeIconIds[className] === childNodeId;
    });
};

var classNameOf1stUnsetChildNodeIcon = function () {
    return childNodeIconClassNames.find(function (className) {
        return !nodeIconIds[className];
    });
};

var setIconForChildNode = function (childNodeId) {
    var className = classNameOfChildNodeIcon(childNodeId);
    if (className) {
        resetNodeIconExpiryTime(className, childNodeId);
        return;
    }

    className = classNameOf1stUnsetChildNodeIcon();
    var allChildNodeIconsAreOccupied = !className;
    if (allChildNodeIconsAreOccupied) {
        return; // may possibly happen after quickly changing around nodes
    }
    setNodeIcon(className, childNodeId);
};

var parseData = function (data) {
    var a = data.split("");
    var parentNodeId = a[0];
    var childNodeId = a[2];
    if (childNodeId === idOfThisNode) {
        setNodeIcon("parent", parentNodeId);
        return;
    }
    if (parentNodeId === idOfThisNode) {
        setIconForChildNode(childNodeId);
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

oscillatorControlEls.frequency.input.
    addEventListener("input", updateOscillatorFrequency);

updateOscillatorFrequency();
updateOscillator();

setNodeIcon("this", idOfThisNode);

setInterval(unsetExpiredNodeIcons, graphUpdateInterval);
