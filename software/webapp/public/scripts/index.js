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
var geometry, material, mesh;

var visualizationEl = document.querySelector("div.visualization");

function init() {
    var width = window.innerWidth - asideWidth;
    var height = window.innerHeight;

    console.log(window.innerWidth);
    console.log(width);

	camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize(width, height);
	visualizationEl.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

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
