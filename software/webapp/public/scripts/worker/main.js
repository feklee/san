/*jslint browser: true, maxlen: 80 */

/*global self, THREE*/

self.importScripts("/bower_components/three.js/build/three.min.js");
self.importScripts("optimize-locations.js");

self.onmessage = function (e) {
    "use strict";
    var locations = self.optimizeLocations(e.data.sortedNodes);
    self.postMessage(locations);
};

/* todo

format for locations, by example:

{
"*": vector,
"A": vector
}

while (true) {
    postMessage(locations);
};
*/
