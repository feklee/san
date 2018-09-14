/*jslint browser: true, maxlen: 80 */

export default {
    asideWidth: 300, // px
    locationOptimizer: {
        resolution: 10, // discrete points per unit in space
        populationSizeFactor: 20, // needs to be even
        seedSizePercentage: 10, // % (existing locations in new population)
        mutationRate: 0.05,
        crossovers: 1
    },
    visualization: {
        locationEasingSpeed: 0.1, // (0, 1]
        nodeDiameter: 0.1,
        nodeColors: {
            "*": ["gray", "orange"],
            "A": ["green", "blue"],
            "B": ["yellow", "yellow"],
            "C": ["blue", "blue"],
            "D": ["red", "red"],
            "E": ["brown", "brown"],
            "F": ["white", "white"]
        },
        defaultNodeColor: "gray",
        edgeColor: "gray"
    }
};
