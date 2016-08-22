
var DEAD      = 0;
var SEED      = 1;
var SPROUT    = 2;
var MATURE    = 3;
var FLOWERING = 4;
var RIPENING  = 5;
var RESTING   = 6;

function Stage(update, frameset) {
  this.update = update;
  this.frameset = frameset || '';
}

var Dead = new Stage(function () { return DEAD; }, '');

var Seed = new Stage(function (growth, terrain) {
  if (growth.roots > 0 || terrain.nutrients + terrain.water > 0.6)
    growth.roots += growth.cost_root * (terrain.water + terrain.nutrients);
  if (growth.roots > 4) return SPROUT;
  return SEED;
}, 'growth-0_1');

var Sprout = new Stage(function (growth, terrain) {
  growth.roots += growth.cost_root * (terrain.water + 0.5 * terrain.nutrients);
  growth.stems += growth.cost_stem * (terrain.water + terrain.nutrients);
  growth.leaves += 0.5 * growth.cost_leaf * (terrain.water + 2 * terrain.light);
  if (growth.leaves > 5) return MATURE;
  return SPROUT;
}, 'growth-1_1');

var Mature = new Stage(function (growth, terrain) {
  growth.roots += 0.5 * growth.cost_root * (terrain.water + 0.5 * terrain.nutrients);
  growth.stems += 0.5 * growth.cost_stem * (terrain.water + terrain.nutrients);
  growth.leaves += 0.5 * growth.cost_leaf * (terrain.water + 2 * terrain.light);
  if (growth.leaves + growth.roots + growth.stems > 20 && growth.ticks > 8) return FLOWERING;
  return MATURE;
}, 'growth-2_1');

var Flowering = new Stage(function (growth, terrain) {
  growth.flowers += 0.5 * growth.flower_cost * (terrain.light + terrain.water + terrain.nutrients);
  if (growth.flowers > 3 && growth.ticks - growth.stage_ticks > 5)
    return RIPENING;
  return  FLOWERING;
}, 'growth-3_1');

var Ripening = new Stage(function (growth) {
  growth.flowers = growth.flowers - 1;
  growth.seeds += growth.cost_seed;
  if (Math.floor(growth.flowers) <= 0) return RESTING;
  return RIPENING;
}, 'growth-4_1');

var Resting = new Stage(function () {
  return RESTING;
}, 'growth-4_1');

module.exports = [Dead, Seed, Sprout, Mature, Flowering, Ripening, Resting];
