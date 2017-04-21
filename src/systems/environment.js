
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var Arable = require('../components/arable.js');
var Spring = require('../components/spring.js');
var Terrain = require('../components/terrain.js');
var TerrainSystem = require('../systems/terrain.js');
var Resources = require('../systems/resources.js');

var lastTick = null;
var MIN_RESOURCE = 0;
var MAX_RESOURCE = 100;
var RANGE_RESOURCE = MAX_RESOURCE - MIN_RESOURCE;

function update(gametime) {
  var DAY = 60*24;
  var time = gametime.time;

  lastTick = lastTick || time;

  Arable.each(updateArable);

  // provide arable resources once per day
  if (time - lastTick < DAY) return;
  Spring.each(updateSpring);
  Arable.each(updateArableResources);
  lastTick = time;
}

function updateArable(arable) {
  var NUM_LEVELS = 4;

  var sprite = Sprite.get(arable.entity);
  var terrain = Terrain.get(arable.entity);

  var adjustedWater = Math.min(arable.water, MAX_RESOURCE - 1);
  var waterLevel = Math.floor(adjustedWater / (RANGE_RESOURCE / NUM_LEVELS)) % NUM_LEVELS;
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
      arable = getArable(i, j);
      if (arable) {
        arable.water = Math.min(arable.water + level, MAX_RESOURCE);
      }
    }
  }
  return spring;
}

function updateArableResources(arable) {
  var isPlanted = arable.planted;
  var wDelta = -(Math.floor(arable.light / 20) + (isPlanted ? 10 : 0));
  var nDelta = isPlanted ? -2 : 10;
  arable.water = Math.max(arable.water + wDelta, MIN_RESOURCE);
  arable.nutrients = Math.max(Math.min(arable.nutrients + nDelta, MAX_RESOURCE), MIN_RESOURCE);
  return arable;
}

function findArablePositions() {
  var positions = [];
  TerrainSystem.each((tile) => {
    var position = Position.get(tile);
    if (getArable(position.x, position.y)){
      positions.push(position);
    }
  });
  return positions;
}

function getArable(x, y) {
  var entity = TerrainSystem.get(x, y);
  if (!entity) return null;

  var arableComponent = Arable.get(entity);
  return arableComponent;
}

function canPlant(x, y) {
  var arable = getArable(x, y);
  return arable && !arable.planted;
}

function plant(entity, x, y) {
  var arable = getArable(x, y);
  var plantable = canPlant(x, y);
  if (!plantable) return;
  arable.planted = entity.id;
  return arable;
}

module.exports = {
  update,
  plant,
  findArablePositions,
  getArable,
  canPlant
};
