/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import settings from "./settings.mjs";
import nodes from "./nodes.mjs";
import edges from "./edges.mjs";

var camera;
var scene;
var renderer;
var controls;

var visualizationEl = document.querySelector("div.visualization");

var updateSize = function () {
    var width = window.innerWidth - settings.asideWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

var destroyObject3D;
destroyObject3D = function (object3D) {
    while (object3D.children.length > 0) {
        destroyObject3D(object3D.children[0]);
        object3D.remove(object3D.children[0]);
    }
    if (object3D.geometry) {
        object3D.geometry.dispose();
    }
    if (object3D.material) {
        object3D.material.dispose();
    }
    if(object3D.texture) {
        object3D.texture.dispose();
    }
};

var createEdgeObject3D = function (edge) {
    var material = new THREE.LineBasicMaterial({color: "gray"});

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3());
    geometry.vertices.push(new THREE.Vector3());

    var line = new THREE.Line(geometry, material);
    scene.add(line);
    edge.object3D = line;
};

var destroyEdgeObject3D = function (edge) {
    destroyObject3D(edge.object3D);
    scene.remove(edge.object3D);
};

var updateEdge = function (edge) {
    var line = edge.object3D;
    var i = 0;
    edge.nodes.forEach(function (node) {
        var animatedLocation = node.animatedLocation;
        var vertex = line.geometry.vertices[i];
        vertex.x = animatedLocation.x;
        vertex.y = animatedLocation.y;
        vertex.z = animatedLocation.z;
        line.geometry.verticesNeedUpdate = true;
        i += 1;
    });
};

var updateEdges = function () {
    edges.forEach(function (edge) {
        updateEdge(edge);
    });
};

var createNodeObject3D = function (node) {
    var geometry = new THREE.SphereGeometry(settings.nodeDiameter, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: node.color});
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    node.object3D = mesh;
};

var destroyNodeObject3D = function (node) {
    destroyObject3D(node.object3D);
    scene.remove(node.object3D);
};

var updateAnimatedLocation = function (node) {
    if (!node.animatedLocation) {
        node.animatedLocation = node.location.clone();
        return;
    }

    var a = node.animatedLocation;
    var b = node.location;
    a.add(b.clone().sub(a).multiplyScalar(settings.easingSpeed));
};

var updateNode = function (node) {
    updateAnimatedLocation(node);
    node.object3D.position.set(
        node.animatedLocation.x,
        node.animatedLocation.y,
        node.animatedLocation.z
    );
};

var updateNodes = function () {
    Object.values(nodes).forEach(updateNode);
};

var animate;
animate = function () {
    window.requestAnimationFrame(animate);
    updateNodes();
    updateEdges();
    controls.update();
    renderer.render(scene, camera);
};

var init = function () {
    camera = new THREE.PerspectiveCamera(50, 1, 0.01, 10);

    controls = new THREE.OrbitControls(camera);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    camera.position.z = 3;
    controls.update();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias: true});
    updateSize();

    visualizationEl.appendChild(renderer.domElement);

    animate();
};

window.addEventListener("resize", updateSize, false);

init();

export default {
    createNodeObject3D: createNodeObject3D,
    destroyNodeObject3D: destroyNodeObject3D,
    createEdgeObject3D: createEdgeObject3D,
    destroyEdgeObject3D: destroyEdgeObject3D
};
