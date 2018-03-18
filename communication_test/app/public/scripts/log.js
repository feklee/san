/*jslint browser: true, maxlen: 80 */

/*global d3 */

var logEl = document.querySelector("ul.log");

var prettyPrinted = function (text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch (ignore) {
        return text;
    }
};

var append = function (type, text) {
    var liEl = document.createElement("li");
    logEl.appendChild(liEl).setAttribute("class", type);
    var preEl = document.createElement("pre");
    liEl.appendChild(preEl).textContent = prettyPrinted(text);
    var parentEl = logEl.parentElement;
    parentEl.scrollTop = parentEl.scrollHeight;
};

var log = {
    appendInput: function (text) {
        append("input", text);
    },
    appendError(text) {
        append("error", text);
    },
    appendWarn(text) {
        append("warn", text);
    },
    appendInfo(text) {
        append("info", text);
    }
};

export default log;
