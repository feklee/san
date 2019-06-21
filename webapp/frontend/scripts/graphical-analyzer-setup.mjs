/*jslint browser: true, maxlen: 80 */

var audioCtx;
var canvasEl;
var analyzer;
var canvasCtx;
var bufferLength;
var dataArray;

var drawZeroLine = function () {
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvasEl.height / 2);
    canvasCtx.lineTo(canvasEl.width, canvasEl.height / 2);
    canvasCtx.strokeStyle = "gray";
    canvasCtx.stroke();
};

var showGraph = function () {
    var hiddenGraphEl = document.querySelector(".hidden.graph");
    if (hiddenGraphEl) {
        hiddenGraphEl.classList.remove("hidden");
    }
};

var drawWaveForm = function () {
    window.requestAnimationFrame(drawWaveForm);

    if (audioCtx.state === "running") {
        showGraph();
    }

    const w = canvasEl.width;
    const h = canvasEl.height;

    analyzer.getByteTimeDomainData(dataArray);
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

var graphicalAnalyzerSetup = function (settings) {
    audioCtx = settings.audioCtx;
    canvasEl = settings.canvasEl;

    analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 8192;
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    canvasCtx = setUpHidpiCanvas(canvasEl);

    settings.input.connect(analyzer);

    drawWaveForm();

    return analyzer;
};

export default graphicalAnalyzerSetup;
