var Terrain = require('../components/terrain.js');
var Position = require('../components/position/position.js');
var pairing = require('../helpers/pairing.js');
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

module.exports = {
  update: update,
  get: get
};
