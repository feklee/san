/*jslint browser: true, maxlen: 80 */

/*global d3 */

var logEl = d3.select("ul.log");

var prettyPrinted = function (text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch (ignore) {
        return text;
    }
};

var append = function (type, text) {
    logEl.append("li").attr("class", type).append("pre").text(
        prettyPrinted(text)
    );
    var parentNode = logEl.node().parentNode;
    parentNode.scrollTop = parentNode.scrollHeight;
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
