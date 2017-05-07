
var _ = require('lodash');
var Entity = require('../base/entity.js');
var Terrain = require('../components/terrain.js');
var Arable = require('../components/arable.js');
var Spring = require('../components/spring.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var Resources = require('../systems/resources.js');
var MapSystem = require('../systems/map');

var pairing = require('../helpers/pairing.js');
var random = require('../base/random.js');
var tiles = {};

var terrainTypes = {
  arable: {
    terrain: { type: 'soil' },
    sprite: { frameset: Resources.getTerrainFrameSetKey('soil', 0) },
    arable: {
      light: [50, 50],
      water: [40, 40],
      nutrients: [60, 100]
    }
  },
  river: {
    terrain: { type: 'spring' },
    sprite: { frameset: Resources.getTerrainFrameSetKey('water') },
    spring: {
      water_level: 6,
      water_range: 1
    }
  }
};

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

function each(fn) {
  return _.each(tiles, fn);
}

function generate(cols, rows) {
  var numRivers = random.int(1, 2);
  var blockInfo = new MapSystem.BlockInfo(cols, rows);

  for (var i = 0; i < numRivers; i++) {
    let point = [0, random.int(Math.floor(cols/3), Math.floor(4 * cols/5))];
    let direction = [random.int(1, 2), random.int(-1, 3)];
    let speed = [random.random() * 2, random.random() / 2];
    blockInfo.addRiver(point, direction, speed);
  }

  var map = MapSystem.generateBlock(blockInfo);
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var block = map[y * rows + x];
      var type = terrainTypes[block || 'arable'];

      var entity = new Entity();
      entity.set(Terrain, type.terrain);
      entity.set(Position, {x: x, y: y});
      generateArable(entity, type.arable);
      generateSpring(entity, type.spring);
      generateSprite(entity, type.sprite);
    }
  }
}

function generateArable(entity, props) {
  if (!props) return;
  var water = random.int(props.water[0], props.water[1]);
  var nutrients = random.int(props.nutrients[0], props.nutrients[1]);
  var light = random.int(props.light[0], props.light[1]);
  return entity.set(Arable, {water: water, nutrients: nutrients, light: light});
}

function generateSpring(entity, props) {
  if (!props) return;
  return entity.set(Spring, {
    water_level: props.water_level,
    water_range: props.water_range
  });
}

function generateSprite(entity, props) {
  if (!props) return;
  return entity.set(Sprite, {layer: 0, frameset: props.frameset});
}

function clear() {
  var tileKeys = _.keys(tiles);
  _.each(tileKeys, function (key) {
    tiles[key].destroy();
    delete tiles[key];
  });

  Arable.cleanup();
  Spring.cleanup();
  Terrain.cleanup();
  Position.cleanup();
}

module.exports = {
  update: update,
  get: get,
  each,
  generate: generate,
  clear: clear
};
