/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import settings from "./settings.js";
import nodes from "./nodes.js";

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
};

var animate;
animate = function () {
    window.requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

var clear;
clear = function (obj) {
    while (obj.children.length > 0) {
        clear(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) {
        obj.geometry.dispose();
    }
    if (obj.material) {
        obj.material.dispose();
    }
    if(obj.texture) {
        obj.texture.dispose();
    }
};

var drawNode = function (node) {
    if (node.location === null) {
        return;
    }

    var geometry = new THREE.SphereGeometry(settings.nodeDiameter, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: "gray"});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.set(node.location.x, node.location.y, node.location.z);
};

var drawNodes = function () {
    Object.values(nodes).forEach(drawNode);
};

var visualize = function () {
    clear(scene);

    drawNodes();

    var material = new THREE.LineBasicMaterial({
        color: "gray"
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 0, 0)
    );

    var line = new THREE.Line(geometry, material);
    scene.add(line);
};

window.addEventListener("resize", updateSize, false);

init();
animate();
visualize();

export default visualize;
