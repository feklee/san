/*jslint browser: true, maxlen: 80 */

/*global THREE*/

import settings from "./settings.mjs";
import { nodeColors } from "./node-colors.mjs";
import visibleNodes from "./visible-nodes.mjs";
import edges from "./edges.mjs";
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
    if(object3D.texture) {
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
        line.geometry.verticesNeedUpdate = true;
        i += 1;
    });
};

var updateEdgeObject3Ds = function () {
    edges.forEach(function (edge) {
        updateEdgeObject3D(edge);
    });
};

var hemisphereColor = function (node, index) {
    var hemisphereColors = nodeColors[node.id];
    if (hemisphereColors === undefined) {
        return settings.visualization.defaultNodeColor;
    }
    var color = hemisphereColors[index];
    if (color === undefined) {
        return settings.defaultNodeColor;
    }
    return color;
};

var createHemisphere = function (color, index) {
    var geometry = new SphereGeometry(vSettings.nodeDiameter,
                                      32, 32, index * Math.PI, Math.PI);
    var material = new MeshBasicMaterial({color: color});
    return new Mesh(geometry, material);
};

var randomlyRotateSphere = function (object3D) {
    // hemispheres have rotational symmetry about z-axis
    object3D.rotation.x = 2 * Math.PI * Math.random();
    object3D.rotation.y = Math.acos(2 * Math.random() - 1);
};

var createNodeObject3D = function (node) {
    var sphere = new THREE.Group();
    [0, 1].forEach(function (i) {
        sphere.add(createHemisphere(hemisphereColor(node, i), i));
    });
    randomlyRotateSphere(sphere);
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

var updateNodeObject3D = function (node) {
    updateAnimatedLocation(node);
    node.object3D.position.set(
        node.animatedLocation.x,
        node.animatedLocation.y,
        node.animatedLocation.z
    );
};

var updateNodeObject3Ds = function () {
    visibleNodes.forEach(updateNodeObject3D);
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
    camera = new PerspectiveCamera(50);

    camera.position.z = 3;

    scene = new Scene();

    renderer = new WebGLRenderer({antialias: true});
    updateSize();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.update();

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
