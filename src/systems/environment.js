
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var Arable = require('../components/arable.js');
var Spring = require('../components/spring.js');
var Terrain = require('../components/terrain.js');
var TerrainSystem = require('../systems/terrain.js');
var Resources = require('../systems/resources.js');

var lastTick = null;
var MIN_WATER = 0;
var MAX_WATER = 100;

function update(gametime) {
  var DAY = 60*24;
  var time = gametime.time;

  lastTick = lastTick || time;

  Arable.each(updateArable);

  // provide arable resources once per day
  if (time - lastTick < DAY) return;
  Spring.each(updateSpring);
  Arable.each(updateArableWater);
  lastTick = time;
}

function updateArable(arable) {
  var NUM_LEVELS = 4;
  var RANGE_WATER = MAX_WATER - MIN_WATER;

  var sprite = Sprite.get(arable.entity);
  var terrain = Terrain.get(arable.entity);

  var adjustedWater = Math.min(arable.water, MAX_WATER - 1);
  var waterLevel = Math.floor(adjustedWater / (RANGE_WATER / NUM_LEVELS)) % NUM_LEVELS;
  sprite.frameset = Resources.getTerrainFrameSetKey(terrain.type, waterLevel);
  return arable;
}

function updateSpring(spring) {
  var range = spring.water_range;
  var level = spring.water_level;
  var {x, y} = Position.get(spring.entity);

  var arable;
  var minX = x - range;
  var maxX = x + range;
  var minY = y - range;
  var maxY = y + range;

  for (var i = minX; i <= maxX; i++) {
    for (var j = minY; j <= maxY; j++) {
      arable = TerrainSystem.arable(i, j);
      if (arable) {
        arable.water = Math.min(arable.water + level, MAX_WATER);
      }
    }
  }
  return spring;
}

function updateArableWater(arable) {
  var waterConsumption = Math.floor(arable.light / 20) + (arable.planted ? 10 : 0);
  arable.water = Math.max(arable.water - waterConsumption, MIN_WATER);
  return arable;
}

module.exports = {
  update
};
