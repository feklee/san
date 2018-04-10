import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";

export default {
    input: "frontend/scripts/index.mjs",
    output: {
        file: "frontend/build/bundle.js",
        format: "iife",
        sourcemap: "inline"
    },
    plugins: [
        copy({
            "frontend/index.html": "frontend/build/index.html",
            "frontend/index.css": "frontend/build/index.css",
            "node_modules/three/build/three.min.js":
                    "frontend/build/three.js",
            "node_modules/three/examples/js/controls/OrbitControls.js":
                    "frontend/build/orbit-controls.js",
            "node_modules/reset-css/reset.css": "frontend/build/reset.css",
            "node_modules/source-code-pro": "frontend/build/source-code-pro"
        }),
        resolve(),
        commonjs()
    ],
    watch: {
        include: [
            "frontend/index.html",
            "frontend/index.css",
            "frontend/scripts/**"
        ]
    }
};
