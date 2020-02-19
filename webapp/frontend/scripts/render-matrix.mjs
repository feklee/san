// Renders the adjacency matrix.

/*jslint browser: true, maxlen: 80 */

import sortedNodes from "./sorted-nodes.mjs";

var matrixEl = document.querySelector("table.matrix");

var clear = function () {
    while (matrixEl.firstChild) {
        matrixEl.removeChild(matrixEl.firstChild);
    }
};

var createSpan = function (text, colors) {
    var spanEl = document.createElement("span");
    spanEl.textContent = text;
    if (text !== 0) {
        spanEl.style.background =
                "conic-gradient(from 45deg, " +
                colors[0] + " 0%, " +
                colors[0] + " 25%, " +
                colors[0] + " 25%, " +
                colors[0] + " 50%, " +
                colors[1] + " 50%, " +
                colors[1] + " 75%, " +
                colors[1] + " 75%, " +
                colors[1] + " 100%)";
        spanEl.style.color = "black";
    }
    return spanEl;
};

var renderHead = function () {
    var headEl = document.createElement("thead");
    matrixEl.appendChild(headEl);
    var rowEl = document.createElement("tr");
    headEl.appendChild(rowEl);
    rowEl.appendChild(document.createElement("th"));
    sortedNodes.forEach(function (node) {
        var cellEl = document.createElement("th");
        rowEl.appendChild(cellEl);
        cellEl.appendChild(createSpan(node.id, node.colors));
    });
};

var renderBody = function (matrix) {
    var bodyEl = document.createElement("tbody");
    matrixEl.appendChild(bodyEl);
    matrix.forEach(function (row, i) {
        var node = sortedNodes[i];
        var rowEl = document.createElement("tr");
        bodyEl.appendChild(rowEl);
        var headerCellEl = document.createElement("th");
        rowEl.appendChild(headerCellEl);
        headerCellEl.appendChild(createSpan(node.id, node.colors));
        row.forEach(function (x) {
            var cellEl = document.createElement("td");
            rowEl.appendChild(cellEl);
            cellEl.appendChild(createSpan(x, node.colors));
        });
    });
};

var render = function (matrix) {
    clear();
    renderHead();
    renderBody(matrix);
};

var connectionToNeighbor = function (node, neighbor) {
    return node.sortedConnections.find(
        function (connection) {
            return connection.toPort.node === neighbor;
        }
    );
};

var createRow = function (node) {
    var row = [];

    sortedNodes.forEach(function (potentialNeighbor) {
        var connection = connectionToNeighbor(
            node,
            potentialNeighbor
        );
        row.push(
            connection === undefined
                ? 0
                : connection.fromPort.portNumber
        );
    });

    return row;
};

var createMatrix = function () {
    var matrix = [];

    sortedNodes.forEach(function (node) {
        matrix.push(createRow(node));
    });

    return matrix;
};

var renderMatrix = function () {
    var matrix = createMatrix();
    render(matrix);
};

export default renderMatrix;
