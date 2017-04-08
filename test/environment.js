
var expect = require('chai').expect;
var Environment = require('../src/systems/environment.js');
var Arable = require('../src/components/arable.js');
var TerrainSystem = require('../src/systems/terrain.js');
var Entity = require('../src/base/entity.js');
var random = require('../src/base/random.js');

describe('environment system', function () {
  random.seed(123);

  before(function () {
    TerrainSystem.generate(4, 4);
    TerrainSystem.update();
  });

  it('can return an arable component', function () {
    const arable = Arable.get(TerrainSystem.get(0, 0));
    expect(Environment.getArable(0, 0)).to.equal(arable);
  });

  it('can find arable tiles', function () {
    const positions = Environment.findArablePositions();
    positions.forEach((position) => {
      expect(Environment.getArable(position.x, position.y)).to.be.truthy;
    });
  });

  it('can plant at an arable location', function () {
    var entity = new Entity();
    var position = Environment.findArablePositions()[0];
    var arable = Arable.get(position.entity);
    Environment.plant(entity, position.x, position.y);
    expect(arable.planted).to.equal(entity.id);
  });

  it('can find plantable tiles', function () {
    var p = Environment.findArablePositions()[0];
    var p2 = Environment.findArablePositions()[1];
    expect(Environment.canPlant(p.x, p.y)).to.equal(false);
    expect(Environment.canPlant(p2.x, p2.y)).to.equal(true);
  });

  after(function () {
    TerrainSystem.clear();
  });
});
