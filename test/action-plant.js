
var expect = require('chai').expect;
var Character = require('../src/systems/character.js');
var TerrainSystem = require('../src/systems/terrain.js');
var ActionPlant = require('../src/systems/action-plant.js');
var random = require('../src/base/random.js');

describe('plant action', function () {
  before(function () {
    random.seed(123);
    TerrainSystem.generate(2, 2);
    TerrainSystem.update();
  });

  it('can perform the plant action', function () {
    var position = TerrainSystem.findArablePositions()[0];
    var arable = TerrainSystem.arable(position.x, position.y);
    var character = new Character(0, 0);
    expect(arable.planted).to.be.falsy;
    ActionPlant.perform(character);
    expect(arable.planted).to.be.truthy;
  });

  after(function () {
    TerrainSystem.clear();
  });
});
