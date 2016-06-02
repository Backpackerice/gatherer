var Entity = require('../base/entity.js');
var Terrain = require('../components/terrain.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var pairing = require('../helpers/pairing.js');
var random = require('../base/random.js');
var tiles = {};

function update() {
  Terrain.each(function (terrain) {
    var entity = terrain.entity;
    var position = Position.get(entity.id);
    var x = position.x;
    var y = position.y;
    var pos = pairing(x, y);
    if (!position) return;

    if (entity.destroyed && tiles[pos] === entity) {
      tiles[pos] = null;
      return;
    }

    if (tiles[pos] !== entity) {
      tiles[pos] = entity;
    }
  });
}

function get(x, y) {
  return tiles[pairing(x, y)];
}

function generate(cols, rows) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var type = soil; // always soil for now
      var water = random.int(type.water[0], type.water[1]);
      var nutrients = random.int(type.nutrients[0], type.nutrients[1]);

      var entity = new Entity();
      entity.set(Terrain, {water: water, nutrients: nutrients});
      entity.set(Position, {x: x, y: y});
      entity.set(Sprite, {layer: 0, frameset: type.frameSet});
    }
  }
}

module.exports = {
  update: update,
  get: get,
  generate: generate
};

// terrain types to randomly generate
var soil = {
  frameSet: 'tile-soil',
  water: [20, 80],
  nutrients: [60, 100]
};
