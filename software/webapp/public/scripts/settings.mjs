/*jslint browser: true, maxlen: 80 */

/*global self, WorkerGlobalScope*/

var settings = {
    asideWidth: 300, // px
    nodeDiameter: 0.1,
    nodeColors: {
        "*": "gray",
        "A": "green",
        "B": "yellow",
        "C": "blue",
        "D": "red",
        "E": "brown",
        "F": "white"
    },
    defaultNodeColor: "gray",
    optimizationResolution: 10
};

var typeofWorkerGlobalScope = typeof WorkerGlobalScope;
var runningInWebWorker = typeofWorkerGlobalScope !== "undefined";
if (runningInWebWorker) {
    self.settings = settings;
}
export default settings;
