/*jslint browser: true, maxlen: 80 */

var logEl = document.querySelector("ul.log");

var prettyPrinted = function (text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch (ignore) {
        return text;
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
    liEl.appendChild(preEl).textContent = prettyPrinted(text);
    removeOverflow();
};

export default {
    append: append
};
