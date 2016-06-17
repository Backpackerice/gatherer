
var expect = require('chai').expect;
var Plant = require('../src/systems/plant.js');
var Genome = require('../src/components/genome.js');
var Position = require('../src/components/position.js');
var TerrainSystem = require('../src/systems/terrain.js');
var GenomeSystem = require('../src/systems/genome.js');
var library = require('../src/helpers/genome-library.js');

describe('plant', function () {
  TerrainSystem.generate(4, 4);
  TerrainSystem.update();
  var generator = GenomeSystem.generator(library);
  it('creates a plant given chromosomes, x, and y', function () {
    var chromosomes = generator.next().value;
    var plant = Plant(chromosomes, 2, 1);
    var genome = Genome.get(plant.id);
    var position = Position.get(plant.id);
    expect(genome.chromosomes).to.deep.equal(chromosomes);
    expect(position.x).to.equal(2);
    expect(position.y).to.equal(1);
  });
});
