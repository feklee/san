/*
 * GradientDescentIterator
 *
 * Inspired by Cory McCartan
 * ©2019 David Mickisch, Felix E. Klee
 */

import {minimize_Powell} from "optimization-js";
import dummy_minimize from "optimization-js";

(function() {
    "use strict";

    // figure out the root object -- window if in browser, global if server, etc.
    let root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    let err = function(e) {
        throw e;
    };

    /**
     * Genetic Optimizer.
     *
     * @param options {object} options for the optimizer 
     *   @param options.length {Number} the length of the chromosome
     *   @param options.radix {Number} the base used  to encode the data
     *   @param options.fitness {Function} the fitness function (passed an
     *   individual, return a number)
     */
    let GradientDescentIterator = function(options) {
        let length = options.length || err("Expected length parameter.");
        let radix = options.radix || err("Expected radix parameter.");
        let fitness = options.fitness || err("Expected fitness parameter.");

        let self = {};

        let currSolution = Array.from({length: length}, () => Math.random() * radix);

        /**
         * Run the algorithm
         * @param max_iters {Number} the number of iterations to run
         */
        self.run = function* (max_iter) {	
            // for every iteration
            for (let i = 0; i !== max_iter; i++) {
                let ret = optimize(currSolution)
                currSolution = ret.argument
                let currFitness = ret.fncvalue

                yield {
                    generation: i,
                    currSolution,
                    best: {
                        params: currSolution,
                        fitness: currFitness
                    }
                };
            }
        }

        var optimize = function(x0) {
            return minimize_Powell(fitness, x0)
        }

        return self;
    };

    var GradientDescentIteratorVERSION = "0.1.0";

    // export the object for Node and the browser.
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = GradientDescentIterator;
        }
        exports.GradientDescentIterator = GradientDescentIterator;
    } else {
        root.GradientDescentIterator = GradientDescentIterator;
    }
})();

export default GradientDescentIterator
