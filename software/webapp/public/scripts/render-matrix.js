/*jslint browser: true, maxlen: 80 */

import nodes from "./nodes.js";

var matrixEl = document.querySelector("table.matrix");

var clear = function () {
    while (matrixEl.firstChild) {
        matrixEl.removeChild(matrixEl.firstChild);
    }
};

var sortNodeIds = function () {
    return Object.keys(nodes).sort();
};

var renderHead = function () {
    var headEl = document.createElement("thead");
    matrixEl.appendChild(headEl);
    var rowEl = document.createElement("tr");
    headEl.appendChild(rowEl);
    rowEl.appendChild(document.createElement("th"));
    var columnIds = sortNodeIds();
    columnIds.forEach(function (nodeId) {
        var cellEl = document.createElement("th");
        cellEl.textContent = nodeId;
        rowEl.appendChild(cellEl);
    });
};

var renderBody = function (matrix) {
    var bodyEl = document.createElement("tbody");
    matrixEl.appendChild(bodyEl);
    var sortedNodeIds = sortNodeIds();
    matrix.forEach(function (row, i) {
        var rowEl = document.createElement("tr");
        bodyEl.appendChild(rowEl);
        var headerCellEl = document.createElement("th");
        headerCellEl.textContent = sortedNodeIds[i];
        rowEl.appendChild(headerCellEl);
        row.forEach(function (x) {
            var cellEl = document.createElement("td");
            cellEl.textContent = x;
            rowEl.appendChild(cellEl);
        });
    });
};

var render = function (matrix) {
    clear();
    renderHead();
    renderBody(matrix);
};

var createRow = function (node, columnIds) {
    var row = [];
    var connectedNodes = Object.values(node.connectedNodes);

    columnIds.forEach(function (columnId) {
        var columnNode = nodes[columnId];
        var i = connectedNodes.indexOf(columnNode);
        row.push(
            i === -1
                ? 0
                : i + 1
        );
    });

    console.log(row);

    return row;
};

var createMatrix = function () {
    var rowIds = sortNodeIds();
    var matrix = [];

    rowIds.forEach(function (nodeId) {
        var node = nodes[nodeId];
        matrix.push(createRow(node, rowIds));
    });

    return matrix;
};

var renderMatrix = function () {
    var matrix = createMatrix();
    render(matrix);
};

document.addEventListener("DOMContentLoaded", function () {
    renderMatrix();
});

export default renderMatrix;
