/*jslint browser: true, maxlen: 80 */

import webSocket from "./web-socket.mjs";
import util from "./util.mjs";
import nodeColors from "./node-colors.mjs";
import {
    graphUpdateInterval, // ms
    gw
} from "./shared-settings.mjs";
import graphicalAnalyzerSetup from "./graphical-analyzer-setup.mjs";

var idOfThisNode = window.location.pathname.substr(1, 1);
var audioCtx = new window.AudioContext();
var noCutoffSymbol = "∞";

var generator = {
    source: undefined,
    offset: audioCtx.createConstantSource(),
    filter1Amplitude: audioCtx.createGain(),
    filter2Offset: audioCtx.createGain()
};

var initialFrequency = 440; // Hz
var oscillationSource =
        util.createOscillationSource(audioCtx, initialFrequency);
var noiseSource = util.createNoiseSource(audioCtx, initialFrequency);

generator.filter1Amplitude.connect(generator.filter2Offset);
generator.offset.start();
generator.offset.connect(generator.filter2Offset);

var setGeneratorSource = function (newSource) {
    if (generator.source === newSource) {
        return;
    }
    if (generator.source) {
        generator.source.audioNode.disconnect();
    }
    generator.source = newSource;
    generator.source.audioNode.connect(generator.filter1Amplitude);
};

setGeneratorSource(oscillationSource);

var controlEl = function (groupClass, nameClass, type) {
    var typeSelector = type !== "input"
        ? "." + type
        : type;
    return document.querySelector(
        "." + groupClass + ".controls ." + nameClass + " " + typeSelector
    );
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

var selectedGeneratorSourceType = function () {
    return document.querySelector("input[name=generator-source-type]:checked")
        .value;
};

var deselectAllRadioButtons = function (selectors) {
    document.querySelectorAll(selectors).forEach(function (el) {
        el.checked = false;
    });
};

var setGeneratorSourceType = function (value) {
    deselectAllRadioButtons("input[name=generator-source-type]");
    var el = document.querySelector(
        "input[name=generator-source-type][value=\"" + value + "\"]"
    );
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
    generator.offset.offset.value = selectedGeneratorOffset();
    generator.filter1Amplitude.gain.value = selectedGeneratorAmplitude();
    var sourceType = selectedGeneratorSourceType();
    if (sourceType === "noise") {
        setGeneratorSource(noiseSource);
    } else {
        setGeneratorSource(oscillationSource);
        oscillationSource.audioNode.type = sourceType;
    }
    generator.source.frequency.value = selectedGeneratorFrequency();
};

var updateGeneratorNumbers = function () {
    updateGeneratorFrequencyNumber();
    controlEl("generator", "detuning", "number").textContent = Math.round(
        controlEl("generator", "detuning", "input").value
    );
    controlEl("generator", "offset", "number").textContent = parseFloat(
        controlEl("generator", "offset", "input").value
    ).toFixed(2);
    controlEl("generator", "amplitude", "number").textContent = parseFloat(
        controlEl("generator", "amplitude", "input").value
    ).toFixed(2);
};

var resumeAudioCtx = function () {
    if (audioCtx.state !== "running") {
        audioCtx.resume();
    }
};

var showButtonEl = document.querySelector(".graph button.show");
showButtonEl.onclick = resumeAudioCtx;

graphicalAnalyzerSetup({
    audioCtx: audioCtx,
    canvasEl: document.querySelector("canvas"),
    input: generator.filter2Offset
});

var selectedModulator = function () {
    return document.querySelector("input[name=modulator]:checked").value;
};

var setModulator = function (value) {
    deselectAllRadioButtons("input[name=modulator]");
    var el = document.querySelector(
        "input[name=modulator][value=\"" + value + "\"]"
    );
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

var selectedOutputCutoffExp = function () {
    return parseFloat(controlEl("output", "cutoff", "input").value);
};

var updateOutputCutoffNumber = function () {
    var outputCutoffExp = selectedOutputCutoffExp();
    var outputCutoff = Math.pow(2, outputCutoffExp); // Hz
    var text = (outputCutoff > 20000)
        ? noCutoffSymbol
        : outputCutoff.toFixed(2);
    controlEl("output", "cutoff", "number").textContent = text;
};

var selectedOutputCutoff = function () { // Hz
    updateOutputCutoffNumber();
    var cutoffText = controlEl("output", "cutoff", "number").textContent;

    if (cutoffText === noCutoffSymbol) {
        return null;
    }

    return parseFloat(cutoffText);
};

var setOutputCutoffExp = function (value) {
    controlEl("output", "cutoff", "input").value = value;
};

var selectedOutputCompressor = function () {
    return controlEl("output", "compressor", "input").checked;
};

var setOutputCompressor = function (value) {
    controlEl("output", "compressor", "input").checked = value;
};

var updateOutputNumbers = function () {
    controlEl("output", "delay", "number").textContent = parseFloat(
        controlEl("output", "delay", "input").value
    ).toFixed(2);
    updateOutputCutoffNumber();
    controlEl("output", "gain", "number").textContent = Math.round(
        100 * controlEl("output", "gain", "input").value
    );
};

var sendSelection = function () {
    var data = {
        type: "audio module",
        modulator: selectedModulator(),
        generator: {
            sourceType: selectedGeneratorSourceType(),
            offset: selectedGeneratorOffset(),
            amplitude: selectedGeneratorAmplitude(),
            frequency: selectedGeneratorFrequency(),
            frequencyExp: selectedGeneratorFrequencyExp(),
            detuning: selectedGeneratorDetuning()
        },
        output: {
            gain: selectedOutputGain(),
            delay: selectedOutputDelay(),
            cutoff: selectedOutputCutoff(),
            cutoffExp: selectedOutputCutoffExp(),
            compressorShouldBeEnabled: selectedOutputCompressor()
        },
        nodeId: idOfThisNode
    };

    try {
        webSocket.send(JSON.stringify(data));
    } catch (ignore) {
    }
};

var parseModuleMessage = function (message) {
    if (idOfThisNode !== message.nodeId) {
        return;
    }

    setGeneratorSourceType(message.generator.sourceType);
    setGeneratorFrequencyExp(message.generator.frequencyExp);
    setGeneratorDetuning(message.generator.detuning);
    setGeneratorOffset(message.generator.offset);
    setGeneratorAmplitude(message.generator.amplitude);
    updateGeneratorNumbers();
    updateGenerator();

    setModulator(message.modulator);

    setOutputDelay(message.output.delay);
    setOutputCutoffExp(message.output.cutoffExp);
    setOutputCompressor(message.output.compressorShouldBeEnabled);
    setOutputGain(message.output.gain);
    updateOutputNumbers();
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
    document.querySelector(
        "ul." + node.type + ".nodes"
    ).appendChild(node.iconEl);
};

var removeNodeIcon = function (node) {
    document.querySelector(
        "ul." + node.type + ".nodes"
    ).removeChild(node.iconEl);
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

var connectionLostErrorEl = document.querySelector(".connection-lost-error");

var setVideoStream = function () {
    const view = document.querySelector(".video img.stream");
    const url =
            "http://" +
            gw.slice(0, 3).join(".") + "." +
            (idOfThisNode.charCodeAt() + 36) +
            ":81";
    view.src = url;
};

var unhideVideo = function () {
    var classList = document.querySelector(".video").classList;
    if (!classList.contains("hidden")) {
        return;
    }
    classList.remove("hidden");
    setVideoStream();
};

var updateVideoVisibility = function (connectionType) {
    if (connectionType === "wifi") {
        unhideVideo();
    }
};

webSocket.setup({
    onopen: function () {
        connectionLostErrorEl.classList.add("hidden");
    },
    onclose: function () {
        connectionLostErrorEl.classList.remove("hidden");
    },
    onmessage: function (e) {
        var message;
        var json;
        if (typeof e.data === "string") {
            json = e.data;
            message = JSON.parse(json);
        } else {
            return;
        }

        updateVideoVisibility(message.connectionType);

        switch (message.type) {
        case "data":
            parseData(message.text);
            break;
        case "audio module":
            parseModuleMessage(message);
            break;
        }
    }
});

webSocket.connect();

document.querySelectorAll("input").forEach(
    (el) => el.addEventListener("input", function () {
        updateGenerator();
        sendSelection();
        resumeAudioCtx();
    })
);

document.querySelectorAll(".output.controls input").forEach(
    (el) => el.addEventListener("input", updateOutputNumbers)
);

document.querySelector("button.reconnect").addEventListener(
    "click",
    function () {
        webSocket.connect();
    }
);

updateGeneratorNumbers();
updateGenerator();
updateOutputNumbers();

setInterval(removeExpiredNodes, graphUpdateInterval);
