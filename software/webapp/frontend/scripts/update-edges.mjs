/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.mjs";
import edges from "./edges.mjs";
import visualization from "./visualization.mjs";

var findEdge = function (node, neighbor) {
    var iterator = edges.values();
    var item = iterator.next();
    var edge;
    while (!item.done) {
        edge = item.value;
        if (edge.nodes.has(node) && edge.nodes.has(neighbor)) {
            return edge;
        }
        item = iterator.next();
    }

    return null;
};

var deleteNonExistingEdges = function (existingEdges) {
    edges.forEach(function (edge) {
        if (!existingEdges.has(edge)) {
            visualization.destroyEdgeObject3D(edge);
            edges.delete(edge);
        }
    });
};

var createEdge = function (node, neighbor) {
    var edge = {
        nodes: new Set([node, neighbor])
    };
    visualization.createEdgeObject3D(edge);
    return edge;
};

export default function () {
    var existingEdges = new Set();

    Object.values(nodes).forEach(function (node) {
        Object.values(node.connections).forEach(function (connection) {
            var edge = findEdge(node, connection.neighbor);
            if (!edge) {
                edge = createEdge(node, connection.neighbor);
                edges.add(edge);
            }
            existingEdges.add(edge);
        });
    });

    deleteNonExistingEdges(existingEdges);
};
