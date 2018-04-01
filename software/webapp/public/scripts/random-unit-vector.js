/*jslint browser: true, maxlen: 80 */

/*global THREE*/

// See article "Generating uniformly distributed numbers on a sphere":
// http://corysimon.github.io/articles/uniformdistn-on-sphere/
export default function () {
    var theta = 2 * Math.PI * Math.random();
    var phi = Math.acos(1 - 2 * Math.random());

    return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
    );
};
