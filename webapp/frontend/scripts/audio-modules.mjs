/*jslint browser: true, maxlen: 80 */

var container = {};

var add = function (nodeId) {
    container[nodeId] = {
        node: null
    };
};

var get = function (nodeId) {
    var module = container[nodeId];
    if (module === undefined) {
        module = add(nodeId);
    }
    return module;
};

export default {
    get: get
};
