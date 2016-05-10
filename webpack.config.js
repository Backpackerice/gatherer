var path = require('path');

module.exports = {
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
