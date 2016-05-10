var path = require('path');

module.exports = {
  entry: "./src/gatherer.js",
  output: {
    path: ".",
    filename: "gatherer.js",
    library: "Gatherer",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader: 'transform?brfs'
      }
    ]
  }
};
