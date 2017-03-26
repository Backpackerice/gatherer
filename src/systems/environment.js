
var Position = require('../components/position.js');
var Arable = require('../components/arable.js');
var Spring = require('../components/spring.js');
var TerrainSystem = require('../systems/terrain.js');

var lastTick = null;

function update(gametime) {
  var DAY = 60*24;
  var time = gametime.time;

  lastTick = lastTick || time;

  // provide arable resources once per day
  if (time - lastTick < DAY) return;
  Spring.each(updateSpring);
  Arable.each(updateArable);
}

function updateSpring(spring) {
  var MAX_LEVEL = 100;
  var range = spring.water_range;
  var level = spring.water_level;
  var {x, y} = Position.get(spring.entity);

  var arable;
  var minX = Math.max(0, x - range);
  var maxX = x + range;
  var minY = Math.max(0, y - range);
  var maxY = y + range;

  for (var i = minX; i < maxX; i++) {
    for (var j = minY; j < maxY; j++) {
      arable = TerrainSystem.arable(i, j);
      if (arable) {
        arable.water = Math.min(arable.water + level, MAX_LEVEL);
      }
    }
  }

  return spring;
}

function updateArable(arable) {
  var MIN_WATER = 0;
  var waterConsumption = Math.floor(arable.light / 10) + (arable.planted ? 10 : 0);
  arable.water = Math.max(arable.water - waterConsumption, MIN_WATER);
  return arable;
}

module.exports = {
  update
};
