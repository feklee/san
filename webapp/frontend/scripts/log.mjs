/*jslint browser: true, maxlen: 80 */

var logEl = document.querySelector("ul.log");

var pad = function (number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
};

var timeStamp = function () {
    var date = new Date();
    var seconds = date.getUTCMilliseconds() / 1000;

    return date.getUTCFullYear() + "-" +
            pad(date.getUTCMonth() + 1) + "-" +
            pad(date.getUTCDate()) + "T" +
            pad(date.getUTCHours()) + ":" +
            pad(date.getUTCMinutes()) + ":" +
            pad(date.getUTCSeconds()) + "." +
            seconds.toFixed(3).slice(2, 5);
};

var prettyPrint = function (text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch (ignore) {
        return timeStamp() + " " + text;
    }
};

var removeOverflow = function () {
    var childNode;
    var parentEl = logEl.parentElement;
    while (parentEl.scrollHeight > parentEl.clientHeight) {
        childNode = logEl.childNodes[0];
        if (childNode === undefined) {
            return;
        }
        logEl.removeChild(childNode);
    }
};

var append = function (type, text) {
    var liEl = document.createElement("li");
    logEl.appendChild(liEl).setAttribute("class", type);
    var preEl = document.createElement("pre");
    liEl.appendChild(preEl).textContent = prettyPrint(text);
    removeOverflow();
};

export default {
    append: append
};
