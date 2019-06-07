import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import legacy from "rollup-plugin-legacy";
import replace from "rollup-plugin-re";

var replaceSettings = {
    include: "frontend/scripts/shared-settings.mjs",
    patterns: [
        {
            file: "../../../nodes/Firmware/sharedSettings.h"
        },
        {
            test: /\}/g,
            replace: "]"
        },
        {
            test: /\{/g,
            replace: "["
        },
        {
            test: /\{\s*(\w+),\s*(\w+)\}/g,
            replace: "[\"$1\", \"$2\"]"
        },
        {
            test: /^\s*const[*\w\s]+\s(\w+)[\[\]0-9]*\s*(.*)$/gm,
            replace: "var $1 $2"
        },
        {
            test: /^\s*#.*/gm,
            replace: ""
        }
    ]
};

var legacySettings = {
    "frontend/scripts/shared-settings.mjs": {
        graphUpdateInterval: "graphUpdateInterval",
        connectionExpiryDuration: "connectionExpiryDuration",
        nodeColorsList: "nodeColorsList"
    }
};

var copyOptions = {
    "node_modules/three/build/three.min.js":
            "frontend/public/build/three.js",
    "node_modules/three/examples/js/controls/OrbitControls.js":
            "frontend/public/build/orbit-controls.js",
    "node_modules/reset-css/reset.css":
            "frontend/public/build/reset.css",
    "node_modules/source-code-pro":
            "frontend/public/build/source-code-pro"
};

export default [{
    input: "frontend/scripts/index.mjs",
    external: ["three"],
    output: {
        file: "frontend/public/build/index.js",
        format: "iife",
        sourcemap: "inline",
        externals: {
        },
        globals: {
            three: "THREE"
        }
    },
    plugins: [
        replace(replaceSettings),
        legacy(legacySettings),
        copy(copyOptions),
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
}, {
    input: "frontend/scripts/node-ui.mjs",
    external: ["three"],
    output: {
        file: "frontend/public/build/node-ui.js",
        format: "iife",
        sourcemap: "inline",
        externals: {
        }
    },
    plugins: [
        replace(replaceSettings),
        legacy(legacySettings),
        commonjs()
    ],
    watch: {
        include: [
            "frontend/node-ui.html",
            "frontend/node-ui.css",
            "frontend/scripts/**"
        ]
    }
}];
