
var Plant = require('./plant.js');
var Active = require('../components/active.js');
var Position = require('../components/position.js');
var Control = require('./controls.js');
var GenomeSystem = require('./genome.js');
var genomeLib = require('./genome-library.js');

var randomGenome = GenomeSystem.generator(genomeLib, 1);

function control() {
  var character = Control.entity();
  var actions = Control.active;
  var active = Active.get(character.id);

  // Character control
  if (character && !character.destroyed && actions.plant) {
    active.action = 'plant';
    return true;
  }
  return false;
}

function perform() {
  var character = Control.entity();
  var position = Position.get(character.id);
  var chromosomes = randomGenome.next();
  var plant = new Plant(chromosomes, position.x, position.y);
  return plant;
}

module.exports = {
  control: control,
  perform: perform
};
