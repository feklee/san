import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
    input: "frontend/public/scripts/index.mjs",
    output: {
        file: "frontend/public/build/bundle.js",
        format: "iife",
        sourcemap: "inline"
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};
