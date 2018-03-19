/*jslint browser: true, maxlen: 80 */

import log from "./log.js";

var hostname = window.location.hostname;
var client = new window.WebSocket("ws://" + hostname + ":8080/");
const asideWidth = 300;

client.onerror = function () {
    log.append("error", "WebSocket error");
};

client.onopen = function () {
    log.append("info", "WebSocket opened");
};

client.onclose = function () {
    log.append("warn", "WebSocket closed");
};

client.onmessage = function (e) {
    var data;
    var json;
    if (typeof e.data === "string") {
        json = e.data;
        data = JSON.parse(json);
    } else {
        return;
    }

    log.append(data.type, data.text);
};

var camera, scene, renderer;
var geometry, material, mesh, controls;

var visualizationEl = document.querySelector("div.visualization");

function init() {
    var width = window.innerWidth - asideWidth;
    var height = window.innerHeight;

	camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 10);

    controls = new THREE.OrbitControls(camera);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

	camera.position.z = 3;
    controls.update();

	scene = new THREE.Scene();

    var material = new THREE.LineBasicMaterial({
	    color: 0x0000ff
    });

    geometry = new THREE.Geometry();
    geometry.vertices.push(
	    new THREE.Vector3(-1, 0, 0),
	    new THREE.Vector3(0, 1, 0),
	    new THREE.Vector3(1, 0, 0)
    );

    var line = new THREE.Line(geometry, material);
    scene.add(line);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize(width, height);
	visualizationEl.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame(animate);

    controls.update();

	renderer.render(scene, camera);
}

function onWindowResize() {
    var width = window.innerWidth - asideWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize, false);

document.addEventListener("DOMContentLoaded", function() {
    var asideEl = document.querySelector("aside");
    asideEl.style.width = asideWidth + "px";
    init();
    animate();
});
