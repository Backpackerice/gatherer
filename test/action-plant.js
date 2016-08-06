
var expect = require('chai').expect;
var Arable = require('../src/components/arable.js');
var Character = require('../src/systems/character.js');
var TerrainSystem = require('../src/systems/terrain.js');
var ActionPlant = require('../src/systems/action-plant.js');

describe('plant action', function () {
  before(function () {
    TerrainSystem.generate(1, 1);
    TerrainSystem.update();
  });

  it('can perform the plant action', function () {
    var tile = TerrainSystem.get(0, 0);
    var arable = Arable.get(tile.id);
    var character = new Character(0, 0);
    expect(arable.planted).to.be.falsy;
    ActionPlant.perform(character);
    expect(arable.planted).to.be.truthy;
  });

  after(function () {
    TerrainSystem.clear();
  });
});
