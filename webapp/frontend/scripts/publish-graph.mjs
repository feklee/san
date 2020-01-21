// Graph for easy 3D visualization, e.g. in 3D graphics programs

import nodes from "./nodes.mjs";
import visibleNodes from "./visible-nodes.mjs";
import nodeColors from "./node-colors.mjs";
import edges from "./edges.mjs";
import colorConvert from "color-convert";
import webSocket from "./web-socket.mjs";

var dupElements = function (array) {
    return array.reduce((res, el) => res.concat([el, el]), []);
};

var colorsOfNode = function (node) {
    return dupElements(
        nodeColors(node.id).map(colorConvert.keyword.rgb)
    );
};

var point = function (node) {
    var location = node.animatedLocation || node.location;
    return location.toArray();
};

var publishGraph = function () {
    var ns = visibleNodes;
    var es = Array.from(edges);

    var data = {
        type: "graph",
        nodeIds: ns.map((n) => n.id),
        points: ns.map(point),
        colors: ns.map(colorsOfNode),
        lines: es.map((e) => Array.from(e.nodes).map(point)),
        tiltAngles: [] // TODO: implement (maybe use random number, if null)
    };

    var json = JSON.stringify(data, function(key, val) {
        return val.toFixed ? Number(val.toFixed(3)) : val;
    });
    webSocket.send(json);
};

export default publishGraph;
