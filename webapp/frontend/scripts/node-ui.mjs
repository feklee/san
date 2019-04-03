/*jslint browser: true, maxlen: 80 */

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");
var nodeId = window.location.pathname.substr(1, 1);

var nameOfSelectedModule = function () {
    return document.querySelector("input[name=module]:checked").value;
};

var sendSelectedModule = function () {
    var data = {
        moduleName: nameOfSelectedModule(),
        nodeId: nodeId
    };
    console.log(JSON.stringify(data));

    try {
        client.send(JSON.stringify(data));
    } catch (ignore) {
    }
};

client.onerror = function () {
    console.log("WebSocket error");
};

client.onopen = function () {
    console.log("WebSocket opened");
    sendSelectedModule();
};

client.onclose = function () {
    console.log("WebSocket closed");
};

var radioButtonEl = function (moduleName) {
    return document.querySelector("#" + moduleName + "-module");
};

var selectModule = function (moduleName) {
    radioButtonEl("sine").checked = true;
};

document.querySelectorAll("input[name=module]").forEach(
    (el) => el.addEventListener("click", sendSelectedModule)
);

selectModule("sine");
