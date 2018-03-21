/*jslint browser: true, maxlen: 80 */

var matrixEl = document.querySelector("table.matrix");
var nodeIds = ["*"];
var matrix = [[0]];

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
    nodeIds.forEach(function (nodeId) {
        var cellEl = document.createElement("th");
        cellEl.textContent = nodeId;
        rowEl.appendChild(cellEl);
    });
};

var renderBody = function () {
    var bodyEl = document.createElement("tbody");
    matrixEl.appendChild(bodyEl);
    matrix.forEach(function (row, i) {
        var rowEl = document.createElement("tr");
        bodyEl.appendChild(rowEl);
        var headerCellEl = document.createElement("th");
        headerCellEl.textContent = nodeIds[i];
        rowEl.appendChild(headerCellEl);
        row.forEach(function (x) {
            var cellEl = document.createElement("td");
            cellEl.textContent = x;
            rowEl.appendChild(cellEl);
        });
    });
};

var render = function () {
    clear();
    renderHead();
    renderBody();
};

var nodeIndex = function (nodeId) {
    return nodeIds.indexOf(nodeId);
};

var addColumn = function () {
    matrix.forEach(function (row) {
        row.push(0);
    });
};

var addRow = function () {
    var row = [];
    matrix[0].forEach(function () {
        row.push(0);
    });
    matrix.push(row);
};

var addNode = function (nodeId) {
    addRow();
    addColumn();
    nodeIds.push(nodeId);
};

var connectNode = function (existingNodeId, existingPortNumber,
                            newNodeId, newPortNumber) {
    var i = nodeIndex(existingNodeId);
    var nodeDoesNotExist = i < 0;
    if (nodeDoesNotExist) {
        return;
    }
    addNode(newNodeId);
    render();
    // fixme: take action if new node also exists (closes loop)
};

document.addEventListener("DOMContentLoaded", function () {
    render();
});

export default {
    connectNode: connectNode
};
