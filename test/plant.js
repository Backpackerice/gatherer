
var expect = require('chai').expect;
var Plant = require('../src/systems/plant.js');
var Growth = require('../src/components/growth.js');
var Genome = require('../src/components/genome.js');
var Position = require('../src/components/position.js');
var Sprite = require('../src/components/sprite.js');
var TerrainSystem = require('../src/systems/terrain.js');

describe('plant', function () {
  TerrainSystem.generate(4, 4);
  TerrainSystem.update();
  it('creates a plant given chromosomes, x, and y', function () {
    var chromosomes = [
      ['tuber.tuber', 'seed.flower.flower'],
      ['', 'edible_stem.seed.edible_leaf'],
      ['seed', 'red.fruit'],
      ['yellow.edible_seed.seed', '']
    ];

    var plant = Plant(chromosomes, 2, 1);

    var growth = Growth.get(plant.id);
    var genome = Genome.get(plant.id);
    var position = Position.get(plant.id);
    var sprite = Sprite.get(plant.id);

    expect(growth).to.be.defined;
    expect(sprite).to.be.defined;
    expect(genome.chromosomes).to.deep.equal(chromosomes);
    expect(position.x).to.equal(2);
    expect(position.y).to.equal(1);
  });
});

describe('plant definitions', function () {
  var expression = {
    traits: {
      tuber: 2,
      seed: 1,
      flower: 2,
      '': 1,
      edible_stem: 1,
      edible_leaf: 1,
      red: 1,
      fruit: 1,
      yellow: 1,
      edible_seed: 1
    },
    counts: [
      {tuber: 2, seed: 1, flower: 2},
      {'': 1, edible_stem: 1, seed: 1, edible_leaf: 1},
      {seed: 1, red: 1, fruit: 1},
      {yellow: 1, edible_seed: 1, seed: 1, '': 1}
    ]
  };

  it('can define properties on components given an expression', function () {
    var growth = new Growth();
    var base = growth.cost_flower;
    var expected = base - base * (expression.traits.flower / 10);
    Plant.define('growth', growth, expression);
    expect(growth.cost_flower).to.equal(expected);
  });
});
