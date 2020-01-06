/*jslint browser: true, maxlen: 80 */

var logEl = document.querySelector("ul.log");
var startTime = Date.now(); // ms

var pad = function (number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
};

var timeStamp = function () {
    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedDeciseconds = Math.floor(elapsedMilliseconds / 100);
    var elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    var elapsedMinutes = Math.floor(elapsedSeconds / 60);
    var elapsedHours = Math.floor(elapsedMinutes / 60);

    var hours = elapsedHours;
    var minutes = elapsedMinutes - 60 * elapsedHours;
    var seconds = elapsedSeconds - 60 * elapsedMinutes;
    var deciseconds = elapsedDeciseconds - 10 * elapsedSeconds;

    return pad(hours) + ":" +
            pad(minutes) + ":" +
            pad(seconds) + "." +
            deciseconds;
};

var removeOverflow = function () {
    var childNode;
    var parentEl = logEl.parentElement;
    var lineHeight = logEl.clientHeight / logEl.childNodes.length;

    // Leave one line at top, potentially partially cropped:
    var maxHeight = parentEl.clientHeight + lineHeight;

    while (logEl.clientHeight > maxHeight) {
        childNode = logEl.childNodes[0];
        if (childNode === undefined) {
            return;
        }
        logEl.removeChild(childNode);
    }
};

var createTiltAngleEl = function (tiltAngle) {
    var spanEl = document.createElement("span");
    spanEl.classList.add("tilt-angle");
    if (tiltAngle === null) {
        spanEl.classList.add("unspecified");
        spanEl.textContent = "◯";
    } else {
        spanEl.textContent = "↑";
        spanEl.style.transform = `rotate(${tiltAngle}rad)`;
    }
    return spanEl;
};

var createSpan = function (text, tiltAngle) {
    var spanEl = document.createElement("span");
    var preEl = document.createElement("pre");
    spanEl.appendChild(preEl).textContent = text;
    if (tiltAngle !== undefined) {
        spanEl.appendChild(createTiltAngleEl(tiltAngle));
    }
    return spanEl;
};

var append = function (type, text, tiltAngle) {
    var liEl = document.createElement("li");
    logEl.appendChild(liEl).classList.add(type);
    liEl.appendChild(createSpan(timeStamp()));
    liEl.appendChild(createSpan(text, tiltAngle));
    removeOverflow();
};

export default {
    append: append
};
