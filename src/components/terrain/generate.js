var Entity = require('../../base/entity.js');
var Position = require('../position/position.js');
var Sprite = require('../sprite.js');
var randInt = require('../../helpers/randInt.js');
var pairing = require('../../helpers/pairing.js');

// terrain types to randomly generate
var soil = require('./soil.js');

module.exports = function (cols, rows) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var type = soil, // always soil for now
          water = randInt(type.water[0], type.water[1]),
          nutrients = randInt(type.nutrients[0], type.nutrients[1]);

      var e = new Entity();
      this.create(water, nutrients).register(e);
      Position.create(x, y).register(e);
      Sprite.create({
        layer: 0,
        x: x,
        y: y,
        frameset: type.frameSet
      }).register(e);

      this.tiles[pairing(x, y)] = e;
    }
  }
  return this;
};