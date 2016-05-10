var Entity = require('../../base/entity.js');
var Position = require('../position/position.js');
var Sprite = require('../sprite/sprite.js');
var randInt = require('../../helpers/randInt.js');
var pairing = require('../../helpers/pairing.js');

// terrain types to randomly generate
var soil = require('./soil.js');

var generate = module.exports = function (cols, rows) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var type = soil, // always soil for now
          water = randInt(type.water[0], type.water[1]),
          nutrients = randInt(type.nutrients[0], type.nutrients[1]);

      var e = new Entity();
      var terrain = this.create(water, nutrients).register(e);
      var position = Position.create(x, y).register(e);
      var sprite = Sprite.create().register(e);

      sprite.setLayer(0); // map layer
      sprite.setXY(x, y);
      sprite.setFrameSet(type.frameSet);

      this.tiles[pairing(x, y)] = e;
    }
  }
  return this;
};