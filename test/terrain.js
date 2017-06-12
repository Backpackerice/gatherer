
var expect = require('chai').expect;
var Terrain = require('../src/components/terrain.js');
var TerrainSystem = require('../src/systems/terrain.js');
var Entity = require('../src/base/entity.js');
var random = require('../src/base/random.js');

describe('terrain component', function () {
  it('initializes with terrain properties', function () {
    var terrain = new Terrain();
    expect(terrain.type).to.be.defined;
  });
});

describe('terrain system', function () {
  random.seed(123);
  it('can generate terrain', function () {
    TerrainSystem.generate(2, 2);
    TerrainSystem.update();
    expect(TerrainSystem.get(0, 0)).to.be.an.instanceof(Entity);
  });

  it('can clear its tiles', function () {
    TerrainSystem.clear();
    expect(TerrainSystem.get(0, 0)).to.be.falsy;
  });
});
