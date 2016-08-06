
var expect = require('chai').expect;
var Terrain = require('../src/components/terrain.js');
var TerrainSystem = require('../src/systems/terrain.js');
var Entity = require('../src/base/entity.js');

describe('terrain component', function () {
  it('initializes with terrain properties', function () {
    var terrain = new Terrain();
    expect(terrain.type).to.be.defined;
  });
});

describe('terrain system', function () {
  it('can generate terrain', function () {
    TerrainSystem.generate(1, 1);
    TerrainSystem.update();
    expect(TerrainSystem.get(0, 0)).to.be.an.instanceof(Entity);
  });

  it('can determine if a location is arable', function () {
    expect(TerrainSystem.arable(0, 0)).to.equal(true);
  });

  it('can plant at a location', function () {
    var entity = new Entity();
    var arable = TerrainSystem.plant(entity, 0, 0);
    expect(TerrainSystem.arable(0, 0)).to.equal(false);
    expect(arable.planted).to.equal(entity.id);
  });

  it('can clear its tiles', function () {
    TerrainSystem.clear();
    expect(TerrainSystem.get(0, 0)).to.be.falsy;
  });
});
