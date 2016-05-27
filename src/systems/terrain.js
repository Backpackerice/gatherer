var Terrain = require('../components/terrain.js');
var Position = require('../components/position/position.js');
var pairing = require('../helpers/pairing.js');
var tiles = {};

function update() {
  Terrain.each(function (terrain) {
    var entity = terrain.entity;
    var position = Position.get(entity.id);
    if (entity.destroyed) {
      // TODO: cleanup
      return;
    }
    var x = position.x;
    var y = position.y;
    if (!position) return;

    var pos = pairing(x, y);
    if (tiles[pos] !== entity) {
      tiles[pos] = entity;
    }
  });
}

function get(x, y) {
  return tiles[pairing(x, y)];
}

module.exports = {
  update: update,
  get: get
};
