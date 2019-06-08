/*jslint browser: true, maxlen: 80 */

import {
    connectionExpiryDuration // ms
} from "./shared-settings.mjs";

var connectionExpiryTime = function () { // ms
    return Date.now() + connectionExpiryDuration;
};

var nodeIsRootNode = function (id) {
    return id === "^";
};

export default {
    connectionExpiryTime: connectionExpiryTime,
    nodeIsRootNode: nodeIsRootNode
};
