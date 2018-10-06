import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import legacy from "rollup-plugin-legacy";
import replace from "rollup-plugin-re";

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

export default {
    input: "frontend/scripts/index.mjs",
    external: ["three"],
    output: {
        file: "frontend/public/build/bundle.js",
        format: "iife",
        sourcemap: "inline",
        externals: {
        },
        globals: {
            three: "THREE"
        }
    },
    plugins: [
        replace({
            include: "frontend/scripts/common-settings.mjs",
            patterns: [
                {
                    file: "../../../nodes/Firmware/commonSettings.h"
                },
                {
                    test: /const\s+[^\s]+/g,
                    replace: "var"
                }
            ]
        }),
        legacy({
            "frontend/scripts/common-settings.mjs": {
                graphUpdateInterval: "graphUpdateInterval",
                connectionExpiryDuration: "connectionExpiryDuration"
            }
        }),
        replace({
            include: "frontend/scripts/node-colors.mjs",
            patterns: [
                {
                    file: "../../../nodes/EepromWriter/nodeColors.h"
                },
                {
                    transform(code) {
                        var re = new RegExp(
                            "setNodeColor\\(" +
                                    "\\s*'(.)'\\s*," +
                                    "\\s*(\\w+)\\s*," +
                                    "\\s*(\\w+)\\s*" +
                                    "\\)\\s*;",
                            "g"
                        );
                        var processedCode = code.replace(
                            re,
                            "\"$1\": [\"$2\", \"$3\"],"
                        );
                        return (
                            "var nodeColors = {" +
                                processedCode +
                                "}"
                        );
                    }
                }
            ]
        }),
        legacy({
            "frontend/scripts/node-colors.mjs": {
                nodeColors: "nodeColors"
            }
        }),
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
};
