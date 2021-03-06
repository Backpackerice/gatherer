
var DEAD      = 0;
var SEED      = 1;
var SPROUT    = 2;
var MATURE    = 3;
var FLOWERING = 4;
var RIPENING  = 5;
var RESTING   = 6;

var DEATH_COLOR = [.1,.1,0,1];

function Stage(update, next) {
  this.update = update;
  this.next = next;
}

var Dead = new Stage(
  function (growth) {
    growth.color_stem = DEATH_COLOR;
    growth.color_leaf = DEATH_COLOR;
  },
  function () { return DEAD; }
);

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
  });

var Sprout = new Stage(
  function (growth) {
    var energy = growth.energy;
    var spent = 0;
    var costRoot = growth.cost_root;
    var costStem = growth.cost_stem * 0.8;
    var costLeaf = growth.cost_leaf * 0.8;
    var maxLeaves = Math.max(growth.stems - growth.leaves, 0);
    var maxStems = Math.max(growth.leaves + 1 - growth.stems, 0);
    var maxRoots = Math.max(growth.stems + growth.leaves - growth.roots, 0);

    var numLeaves = Math.min(Math.floor(energy / costLeaf), maxLeaves);
    spent += numLeaves * costLeaf;
    var numStems = Math.min(Math.floor((energy - spent)/costStem), maxStems);
    spent += numStems * costStem;
    var numRoots = Math.min(Math.floor((energy - spent)/costRoot), maxRoots);
    spent += numRoots * costRoot;

    growth.energy -= spent;
    growth.roots += numRoots;
    growth.stems += numStems;
    growth.leaves += numLeaves;

    return growth;
  },
  function (growth) {
    if (growth.leaves > 5) return MATURE;
    return SPROUT;
  });

var Mature = new Stage(
  function (growth) {
    var energy = growth.energy;
    var spent = 0;
    var costRoot = growth.cost_root;
    var costStem = growth.cost_stem;
    var costLeaf = growth.cost_leaf;
    var maxLeaves = Math.max(growth.stems - growth.leaves, 0);
    var maxStems = Math.max(growth.leaves + 1 - growth.stems, 0);
    var maxRoots = Math.max(growth.stems + growth.leaves - growth.roots, 0);

    var numLeaves = Math.min(Math.floor(energy / costLeaf), maxLeaves);
    spent += numLeaves * costLeaf;
    var numStems = Math.min(Math.floor((energy - spent)/costStem), maxStems);
    spent += numStems * costStem;
    var numRoots = Math.min(Math.floor((energy - spent)/costRoot), maxRoots);
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
  });

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
  });

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
  });

var Resting = new Stage(
  function (growth) {
    return growth;
  },
  function () {
    return RESTING;
  });

module.exports = [Dead, Seed, Sprout, Mature, Flowering, Ripening, Resting];
