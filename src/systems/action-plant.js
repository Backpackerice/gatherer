
var _ = require('lodash');
var Plant = require('./plant.js');
var Position = require('../components/position.js');
var GenomeSystem = require('./genome.js');
var TerrainSystem = require('./terrain.js');
var genomeLib = require('./genome-library.js');

var randomGenome = GenomeSystem.generator(genomeLib, 1);
var timeout = 500;
// TODO: convert timeout system to action frames

function perform(character) {
  var position = Position.get(character.id);
  var x = Math.round(position.x);
  var y = Math.round(position.y);

  var canPlant = TerrainSystem.arable(x, y);
  var chromosomes;
  var plant;

  if (canPlant) {
    chromosomes = randomGenome.next().value;
    plant = new Plant(chromosomes, x, y);
    TerrainSystem.plant(plant, x, y);
  }
  return plant;
}

module.exports = {
  perform: _.throttle(perform, timeout, {trailing: false})
};
