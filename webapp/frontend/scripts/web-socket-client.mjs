/*jslint browser: true, maxlen: 80 */

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");

export default client;
