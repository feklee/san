/*jslint browser: true, maxlen: 80 */

export default {
    asideWidth: 300, // px
    defaultNodeColor: "#111",
    locationOptimizer: {
        sideLength: 3, // size of box containing solution
        resolution: 5, // discrete points per unit in space
        populationSize: 20, // needs to be even
        seedSize: 1, // # existing locations in new population
        mutationRate: 0.01,
        crossovers: 10
    },
    visualization: {
        locationEasingSpeed: 0.1, // (0, 1]
        nodeDiameter: 0.1,
        edgeColor: "gray"
    }
};
