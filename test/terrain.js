
var expect = require('chai').expect;
var Terrain = require('../src/components/terrain.js');
var Arable = require('../src/components/arable.js');
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

  it('can determine if a location is arable', function () {
    const isArable = Arable.get(TerrainSystem.get(0, 0));
    expect(TerrainSystem.arable(0, 0)).to.equal(isArable);
  });

  it('can find arable tiles', function () {
    const positions = TerrainSystem.findArablePositions();
    positions.forEach((position) => {
      expect(TerrainSystem.arable(position.x, position.y)).to.be.truthy;
    });
  });

  it('can plant at an arable location', function () {
    var entity = new Entity();
    var position = TerrainSystem.findArablePositions()[0];
    var arable = Arable.get(position.entity);
    TerrainSystem.plant(entity, position.x, position.y);
    expect(arable.planted).to.equal(entity.id);
  });

  it('can find plantable tiles', function () {
    var p = TerrainSystem.findArablePositions()[0];
    var p2 = TerrainSystem.findArablePositions()[1];
    expect(TerrainSystem.plantable(p.x, p.y)).to.equal(false);
    expect(TerrainSystem.plantable(p2.x, p2.y)).to.equal(true);
  });

  it('can clear its tiles', function () {
    TerrainSystem.clear();
    expect(TerrainSystem.get(0, 0)).to.be.falsy;
  });
});
