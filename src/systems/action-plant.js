
var Plant = require('./plant.js');
var Position = require('../components/position.js');
var GenomeSystem = require('./genome.js');
var genomeLib = require('./genome-library.js');

var randomGenome = GenomeSystem.generator(genomeLib, 1);

function perform(character) {
  var position = Position.get(character.id);
  var chromosomes = randomGenome.next().value;
  var plant = new Plant(chromosomes, position.x, position.y);
  return plant;
}

module.exports = {
  perform: perform
};
