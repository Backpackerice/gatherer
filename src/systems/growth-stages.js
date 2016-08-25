
var DEAD      = 0;
var SEED      = 1;
var SPROUT    = 2;
var MATURE    = 3;
var FLOWERING = 4;
var RIPENING  = 5;
var RESTING   = 6;

function Stage(update, next, frameset) {
  this.update = update;
  this.next = next;
  this.frameset = frameset || '';
}

var Dead = new Stage(function () { return DEAD; }, '');

var Seed = new Stage(
  function (growth) {
    var costRoot = growth.cost_root * 0.75; // reduce cost for roots
    var energy = growth.energy;
    var numRoots = Math.floor(energy / costRoot);

    growth.energy -= numRoots * costRoot;
    growth.roots += numRoots;
    return growth;
  },
  function (growth) {
    if (growth.roots > 4) return SPROUT;
    return SEED;
  }, 'growth-0_1');

var Sprout = new Stage(
  function (growth) {
    var energy = growth.energy;
    var spent = 0;
    var costRoot = growth.cost_root;
    var costStem = growth.cost_stem * 0.8;
    var costLeaf = growth.cost_leaf * 0.8;

    var numLeaf = Math.min(Math.floor(energy / costLeaf), growth.stems / 2);
    spent += numLeaf * costLeaf;
    var numStem = Math.min(Math.floor((energy - spent)/costStem), growth.leaf * 2 + 1);
    spent += numStem * costStem;
    var numRoot = Math.floor((energy - spent)/costRoot);
    spent += numRoot * costRoot;

    growth.energy -= spent;
    growth.roots += numRoot;
    growth.stems += numStem;
    growth.leaves += numLeaf;

    return growth;
  },
  function (growth) {
    if (growth.leaves > 5) return MATURE;
    return SPROUT;
  }, 'growth-1_1');

var Mature = new Stage(
  function (growth) {
    var energy = growth.energy;
    var spent = 0;
    var costRoot = growth.cost_root;
    var costStem = growth.cost_stem;
    var costLeaf = growth.cost_leaf;

    var numLeaves = Math.min(Math.floor(energy / costLeaf), growth.stems);
    spent += numLeaves * costLeaf;
    var numStems = Math.min(Math.floor((energy - spent)/costStem), growth.leaf + 1);
    spent += numStems * costStem;
    var numRoots = Math.floor((energy - spent)/costRoot);
    spent += numRoots * costRoot;

    growth.energy -= spent;
    growth.roots += numRoots;
    growth.stems += numStems;
    growth.leaves += numLeaves;

    return growth;
  },
  function (growth) {
    if (growth.leaves + growth.roots + growth.stems > 20 && growth.ticks > 8) return FLOWERING;
    return MATURE;
  }, 'growth-2_1');

var Flowering = new Stage(
  function (growth) {
    var costFlower = growth.cost_flower;
    var energy = growth.energy;
    var numFlowers = Math.floor(energy / costFlower);

    growth.energy -= numFlowers * costFlower;
    growth.flowers += numFlowers;
    return growth;
  },
  function (growth) {
    if (growth.flowers > 3 && growth.ticks - growth.stage_ticks > 5)
      return RIPENING;
    return FLOWERING;
  }, 'growth-3_1');

var Ripening = new Stage(
  function (growth) {
    var costSeed = growth.cost_seed;
    var energy = growth.energy;
    var numFlowers = growth.flowers;
    var numSeeds = Math.min(Math.floor(energy / costSeed), numFlowers, 1);

    growth.energy -= numSeeds * costSeed;
    growth.flowers -= numSeeds;
    growth.seeds += numSeeds;
    return growth;
  },
  function (growth) {
    growth.flowers = growth.flowers - 1;
    growth.seeds += growth.cost_seed;
    if (Math.floor(growth.flowers) <= 0) return RESTING;
    return RIPENING;
  }, 'growth-4_1');

var Resting = new Stage(
  function (growth) {
    return growth;
  },
  function () {
    return RESTING;
  }, 'growth-4_1');

module.exports = [Dead, Seed, Sprout, Mature, Flowering, Ripening, Resting];
