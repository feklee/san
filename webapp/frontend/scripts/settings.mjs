/*jslint browser: true, maxlen: 80 */

export default {
    asideWidth: 300, // px
    locationOptimizer: {
        resolution: 5, // discrete points per unit in space
        populationSizeFactor: 0.5, // needs to be even (TODO: better round population size to even using sth. like `makeEven` - round up not to be too small or even zero)
        seedSizePercentage: 0 /* TODO */, // % (existing locations in new population)
        mutationRate: 0.05,
        crossovers: 1
    },
    visualization: {
        locationEasingSpeed: 0.1, // (0, 1]
        nodeDiameter: 0.1,
        defaultNodeColor: "#111",
        edgeColor: "gray"
    }
};
