
var Plant = require('./plant.js');
var Active = require('../components/active.js');
var Position = require('../components/position.js');
var GenomeSystem = require('./genome.js');
var genomeLib = require('./genome-library.js');

var randomGenome = GenomeSystem.generator(genomeLib, 1);

function perform(character) {
  var active = Active.get(character.id);
  var position = Position.get(character.id);
  var chromosomes = randomGenome.next();
  var plant = new Plant(chromosomes, position.x, position.y);

  active.action = 'plant';
  return plant;
}

module.exports = {
  perform: perform
};
