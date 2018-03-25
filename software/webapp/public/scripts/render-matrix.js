/*jslint browser: true, maxlen: 80 */

import sortedNodes from "./sorted-nodes.js";

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

var createRow = function (node) {
    var row = [];
    var neighbors = Object.values(node.neighbors);

    sortedNodes.forEach(function (node) {
        var i = neighbors.indexOf(node);
        row.push(
            i === -1
                ? 0
                : i + 1
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

document.addEventListener("DOMContentLoaded", function () {
    renderMatrix();
});

export default renderMatrix;
