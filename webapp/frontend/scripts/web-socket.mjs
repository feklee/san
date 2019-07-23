/*jslint browser: true, maxlen: 80 */

var settings;
var client;

var setup = function (x) {
    settings = x;
};

var connect = function () {
    client = new window.WebSocket("ws://" + window.location.host);
    client.onerror = settings.onerror;
    client.onopen = settings.onopen;
    client.onclose = settings.onclose;
    client.onmessage = settings.onmessage;
};

export default {
    setup: setup,
    connect: connect
};
