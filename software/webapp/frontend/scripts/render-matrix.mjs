// Renders the adjacency matrix.

/*jslint browser: true, maxlen: 80 */

import sortedNodes from "./sorted-nodes.mjs";

var matrixEl = document.querySelector("table.matrix");

var clear = function () {
    while (matrixEl.firstChild) {
        matrixEl.removeChild(matrixEl.firstChild);
    }
};

var renderHead = function () {
    var headEl = document.createElement("thead");
    matrixEl.appendChild(headEl);
    var rowEl = document.createElement("tr");
    headEl.appendChild(rowEl);
    rowEl.appendChild(document.createElement("th"));
    sortedNodes.forEach(function (node) {
        var cellEl = document.createElement("th");
        cellEl.textContent = node.id;
        rowEl.appendChild(cellEl);
    });
};

var renderBody = function (matrix) {
    var bodyEl = document.createElement("tbody");
    matrixEl.appendChild(bodyEl);
    matrix.forEach(function (row, i) {
        var rowEl = document.createElement("tr");
        bodyEl.appendChild(rowEl);
        var headerCellEl = document.createElement("th");
        headerCellEl.textContent = sortedNodes[i].id;
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
