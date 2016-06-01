var Entity = require('../base/entity.js');
var Terrain = require('../components/terrain.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var randInt = require('../helpers/randInt.js');

function map(cols, rows) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var type = soil; // always soil for now
      var water = randInt(type.water[0], type.water[1]);
      var nutrients = randInt(type.nutrients[0], type.nutrients[1]);

      var entity = new Entity();
      entity.set(Terrain, {water: water, nutrients: nutrients});
      entity.set(Position, {x: x, y: y});
      entity.set(Sprite, {layer: 0, frameset: type.frameSet});
    }
  }
}

module.exports = map;

// terrain types to randomly generate
var soil = {
  frameSet: 'tile-soil',
  water: [20, 80],
  nutrients: [60, 100]
};
