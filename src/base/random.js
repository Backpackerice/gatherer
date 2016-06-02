
var MersenneTwister = require('mersenne-twister');
var mt = new MersenneTwister();

function seed(value) {
  mt.init_seed(value);
}

function randInt(min, max) { // [min, max)
  return Math.floor(mt.random() * (max - min)) + min;
}

module.exports = {
  seed: seed,
  int: randInt
};
