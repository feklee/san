/*jslint browser: true, maxlen: 80 */

import settings from "./settings.mjs";
import visibleNodes from "./visible-nodes.mjs";
import edges from "./edges.mjs";
import vector from "./vector.mjs";
import {
    Vector3,
    Geometry,
    Line,
    LineBasicMaterial,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "../../node_modules/three/build/three.module.js";
import THREE from "three";

var vSettings = settings.visualization;
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
    if (object3D.texture) {
        object3D.texture.dispose();
    }
};

var createEdgeObject3D = function (edge) {
    var material = new LineBasicMaterial({
        color: vSettings.edgeColor
    });

    var geometry = new Geometry();
    geometry.vertices.push(new Vector3());
    geometry.vertices.push(new Vector3());

    var line = new Line(geometry, material);
    scene.add(line);
    edge.object3D = line;
};

var destroyEdgeObject3D = function (edge) {
    destroyObject3D(edge.object3D);
    scene.remove(edge.object3D);
};

var updateEdgeObject3D = function (edge) {
    var line = edge.object3D;
    var i = 0;
    edge.nodes.forEach(function (node) {
        var animatedLocation = node.animatedLocation;
        var vertex = line.geometry.vertices[i];
        vertex.x = animatedLocation.x;
        vertex.y = animatedLocation.y;
        vertex.z = animatedLocation.z;
        line.geometry.computeBoundingSphere(); // prevents lines from
                                               // randomly
                                               // disappearing
        line.geometry.verticesNeedUpdate = true;
        i += 1;
    });
};

var updateEdgeObject3Ds = function () {
    edges.forEach(function (edge) {
        updateEdgeObject3D(edge);
    });
};

var createHemisphere = function (color, index) {
    var geometry = new SphereGeometry(
        vSettings.nodeDiameter,
        32,
        32,
        index * Math.PI,
        Math.PI
    );
    var material = new MeshBasicMaterial({color: color});
    return new Mesh(geometry, material);
};

var createNodeObject3D = function (node) {
    var sphere = new THREE.Group();
    [0, 1].forEach(function (i) {
        sphere.add(createHemisphere(node.colors[i], i));
    });
    scene.add(sphere);
    node.object3D = sphere;
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
    a.add(b.clone().sub(a).multiplyScalar(
        vSettings.locationEasingSpeed
    ));
};

var setLocationOfNodeObject3D = function (node) {
    node.object3D.position.set(
        node.animatedLocation.x,
        node.animatedLocation.y,
        node.animatedLocation.z
    );
};

var rotateNodeObject3D = function (node) {
    node.object3D.lookAt(node.location.clone().add(node.axis));
    return; // TODO

    if (node.tiltAngle !== null) {
//        node.object3D.rotation.x = node.tiltAngle;
        // TOOO: Create separate function that rotates according to axis orientation

        if (node.visibleConnections[0]) { // TODO: better create an axis first (the vector pointing upwards when the node is not tilted)
            var connection = node.visibleConnections[0];
            node.object3D.lookAt(connection.toPort.node.location);
//            node.object3D.rotation.z =
//                vector.angleInXYPlane(connection.vector);
        }
        // TODO: rotate about z matching the connections to neighbor(s)
    }
/* TODO
    node.visibleConnections.forEach(function (connection) {
        
    });
*/

/* TODO:
    node.object3D.rotation.x = 2 * Math.PI * Math.random();
    node.object3D.rotation.y = Math.acos(2 * Math.random() - 1);
*/
};

var updateNodeObject3D = function (node) {
    updateAnimatedLocation(node);
    setLocationOfNodeObject3D(node);
    rotateNodeObject3D(node);
};

var updateNodeObject3Ds = function () {
    visibleNodes.forEach(updateNodeObject3D);
};

var drawCoordinateCross = function () { // TODO: for debugging
    var g;
    g = new Geometry();
    g.vertices.push(new Vector3(0, 0, 0));
    g.vertices.push(new Vector3(.25, 0, 0));
    scene.add(new Line(g, new LineBasicMaterial({color: "darkred"})));
    g = new Geometry();
    g.vertices.push(new Vector3(0, 0, 0));
    g.vertices.push(new Vector3(0, .25, 0));
    scene.add(new Line(g, new LineBasicMaterial({color: "darkgreen"})));
    g = new Geometry();
    g.vertices.push(new Vector3(0, 0, 0));
    g.vertices.push(new Vector3(0, 0, .25));
    scene.add(new Line(g, new LineBasicMaterial({color: "gray"})));
};

var animate;
animate = function () {
    window.requestAnimationFrame(animate);
    updateNodeObject3Ds();
    updateEdgeObject3Ds();
    controls.update();
    renderer.render(scene, camera);
};

var init = function () {
    camera = new PerspectiveCamera();

    camera.position.set(0, -3, 0);
    camera.up.set(0, 0, 1);

    scene = new Scene();

    renderer = new WebGLRenderer({antialias: true});
    updateSize();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.update();

    drawCoordinateCross();

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
