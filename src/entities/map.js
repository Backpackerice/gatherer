var Entity = require('../base/entity.js');
var Terrain = require('../components/terrain.js');
var Position = require('../components/position/position.js');
var Sprite = require('../components/sprite.js');
var randInt = require('../helpers/randInt.js');

function map(cols, rows) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var type = soil, // always soil for now
          water = randInt(type.water[0], type.water[1]),
          nutrients = randInt(type.nutrients[0], type.nutrients[1]);

      var entity = new Entity();
      Terrain.create({water: water, nutrients: nutrients}).register(entity);
      Position.create(x, y).register(entity);
      Sprite.create({
        layer: 0,
        x: x,
        y: y,
        frameset: type.frameSet
      }).register(entity);
    }
  }
  return entity;
}

module.exports = map;

// terrain types to randomly generate
var soil = {
  frameSet: 'tile-soil',
  water: [20, 80],
  nutrients: [60, 100]
};
