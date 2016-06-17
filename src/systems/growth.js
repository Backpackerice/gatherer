
var Entity = require('../base/entity.js');
var Growth = require('../components/growth.js');
var Position = require('../components/position.js');
var Terrain = require('../components/terrain.js');
var Sprite = require('../components/sprite.js');
var TerrainSystem = require('../systems/terrain.js');

var GrowthStages = require('./growth-stages.js');

function update(gametime) {
  var DAY = 60*24;
  var time = gametime.time;
  Growth.each(function (growth) {
    var entity = growth.entity;
    if (entity.destroyed) return;

    var position = Position.get(entity.id);
    var sprite = Sprite.get(entity.id);

    var tile = TerrainSystem.get(position.x, position.y);
    var terrain = Terrain.get(tile.id);

    var stage = growth.stage;
    var newEnergy = 0;
    var newStage  = stage;

    growth.last_tick = growth.last_tick || time;
    if ((time - growth.last_tick) * growth.tick_rate > DAY) {
      newEnergy = energy(growth, terrain, time);
      newStage = GrowthStages[stage].update(growth, terrain, time);
      growth.death_ticks += 1 * !newEnergy;
      growth.last_tick = time;
      growth.stage_ticks++;
      growth.ticks++;
    }

    if (stage !== newStage) growth.stage_ticks = 0;
    growth.energy = Math.min(growth.max_energy, growth.energy + newEnergy);
    growth.stage = newStage;
    sprite.frameset = GrowthStages[newStage].frameset;
  });
}

function energy(growth, terrain) {
  var dWater = Math.abs(growth.affinity_water - terrain.water);
  var dSoil  = Math.abs(growth.affinity_soil  - terrain.nutrients);
  var dLight = Math.abs(growth.affinity_light - terrain.light);
  var water = dWater < 10 * growth.affinity_water / 5;
  var soil  = dSoil  < 10 * growth.affinity_soil  / 5;
  var light = dLight < 10 * growth.affinity_light / 5;
  if (!(water + soil) || !(water + light) || !(soil + light)) return false;
  return water + soil + light;
}

function generate(genome, x, y) {
  var terrain = TerrainSystem.get(x, y);
  if (!terrain) return;

  var plant = new Entity();
  plant.set(Position, {x: x, y: y});
  plant.set(Sprite, {layer: 1});

  // TODO: extract traits
  plant.set(Growth, {});
  return plant;
}

module.exports = {
  update: update,
  generate: generate
};
