
var MersenneTwister = require('mersenne-twister');
var mt = new MersenneTwister();

function seed(value) {
  mt = new MersenneTwister(value);
}

function random() {
  return mt.random();
}

function randInt(min, max) { // [min, max)
  return Math.floor(random() * (max - min)) + min;
}

module.exports = {
  seed: seed,
  random: random,
  int: randInt
};
