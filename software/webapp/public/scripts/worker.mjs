/*jslint browser: true, maxlen: 80 */

var worker = new window.Worker("scripts/worker/main.js", {
    type: "module"
});

export default worker;
