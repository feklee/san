// Graph for easy 3D visualization, e.g. in 3D graphics programs

import visibleNodes from "./visible-nodes.mjs";
import {rgbColorsOfNode} from "./colors.mjs";
import edges from "./edges.mjs";
import webSocket from "./web-socket.mjs";
import util from "./util.mjs";

var point = function (node) {
    var location = node.animatedLocation || node.location;
    return location.toArray();
};

var sendGraph = function () {
    var ns = visibleNodes;
    var es = Array.from(edges);

    var data = {
        type: "graph",
        nodeIds: ns.map((n) => n.id),
        nodeIps: ns.map((n) => util.ipOfNode(n.id)),
        points: ns.map(point),
        colors: ns.map((n) => rgbColorsOfNode(n.id)),
        edges: es.map((e) => Array.from(e.nodes).map((n) => n.id)),
        axes: ns.map((node) => node.axis.toArray()),
        neighbors: ns.map(
            (n) => n.visibleConnections.map((c) => c.toPort.node.id)
        )
    };

    var json = JSON.stringify(data, function (ignore, val) {
        return val.toFixed
            ? Number(val.toFixed(3))
            : val;
    });
    webSocket.send(json);
};

export default sendGraph;
