
var Growth = require('../components/growth.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var Arable = require('../components/arable.js');
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
    var arable = Arable.get(tile.id);

    var stage = growth.stage;
    var newEnergy = 0;
    var newStage  = stage;

    growth.last_tick = growth.last_tick || time;
    if ((time - growth.last_tick) * growth.tick_rate > DAY) {
      newEnergy = energy(growth, arable, time);
      growth.death_ticks += 1 * !newEnergy;

      GrowthStages[stage].update(growth, arable, time);
      newStage = GrowthStages[stage].next(growth, arable, time);

      growth.last_tick = time;
      growth.stage_ticks++;
      growth.ticks++;
    }

    if (stage !== newStage) growth.stage_ticks = 0;
    growth.energy = Math.min(growth.max_energy, growth.energy + newEnergy);
    growth.stage = newStage;

    sprite.frameset = frameset(growth);
  });
}

function frameset({ stems, appearance_stem }) {
  var stemFrameset = 'growth-0_1';
  if (stems > 0) {
    var stemSize = Math.floor(Math.min(stems, 9)) - 1; // max 80
    stemSize = stemSize * 10 || 5;
    stemFrameset = `herbs.${appearance_stem}.${stemSize}`;
  }
  return stemFrameset;
}

function energy(growth, arable) {
  var dWater = Math.abs(growth.affinity_water - arable.water);
  var dSoil  = Math.abs(growth.affinity_soil  - arable.nutrients);
  var dLight = Math.abs(growth.affinity_light - arable.light);
  var water = dWater < 10 * growth.affinity_water / 5;
  var soil  = dSoil  < 10 * growth.affinity_soil  / 5;
  var light = dLight < 10 * growth.affinity_light / 5;
  if (!(water + soil) || !(water + light) || !(soil + light)) return false;
  return water + soil + light;
}

module.exports = {
  update: update
};
