
var expect = require('chai').expect;
var Growth = require('../src/components/growth.js');
var Position = require('../src/components/position.js');
var GrowthSystem = require('../src/systems/growth.js');
var TerrainSystem = require('../src/systems/terrain.js');
var Entity = require('../src/base/entity.js');

describe('growth component', function () {
  var growth;

  it('initializes in the dormant stage', function () {
    growth = new Growth();
    expect(growth.stage).to.equal(Growth.DORMANT);
  });
});

describe('growth system', function () {
  TerrainSystem.generate(4, 4); // 0-3 grid
  var entity = new Entity();
  var growth = entity.set(Growth);
  var position = entity.set(Position, {x: 0, y: 0});

  it('updates each entity\'s growth if it also has a position', function () {
    GrowthSystem.update();
    expect(growth.last_tick).to.be.truthy();
  });
});
