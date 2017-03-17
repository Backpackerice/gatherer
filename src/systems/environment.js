
var Position = require('../components/position.js');
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

module.exports = {
  update
};
