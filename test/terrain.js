
var expect = require('chai').expect;
var Terrain = require('../src/components/terrain.js');
var TerrainSystem = require('../src/systems/terrain.js');
var Entity = require('../src/base/entity.js');

describe('terrain component', function () {
  it('initializes with terrain properties', function () {
    var terrain = new Terrain();
    expect(terrain.water).to.equal(0);
    expect(terrain.nutrients).to.equal(0);
    expect(terrain.light).to.equal(0);
    expect(terrain.plantable).to.equal(false);
    expect(terrain.planted).to.equal(false);
  });
});

describe('terrain system', function () {
  it('can generate terrain', function () {
    TerrainSystem.generate(1, 1);
    expect(TerrainSystem.get(0, 0)).to.be.an.instanceof(Terrain);
  });

  it('can determine if a location is plantable', function () {
    expect(TerrainSystem.plantable(0, 0)).to.equal(true);
  });

  it('can plant at a location', function () {
    var entity = new Entity();
    var terrain = TerrainSystem.plant(entity, 0, 0);
    expect(TerrainSystem.plantable(0, 0)).to.equal(false);
    expect(terrain.planted).to.equal(entity.id);
  });
});
