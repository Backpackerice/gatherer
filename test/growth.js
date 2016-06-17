
var expect = require('chai').expect;
var Plant = require('../src/systems/plant.js');
var Growth = require('../src/components/growth.js');
var GenomeSystem = require('../src/systems/genome.js');
var GrowthSystem = require('../src/systems/growth.js');
var TerrainSystem = require('../src/systems/terrain.js');
var GameTime = require('../src/base/time.js');
var library = require('../src/helpers/genome-library.js');

describe('growth system', function () {
  TerrainSystem.generate(4, 4);
  TerrainSystem.update();
  var gametime = new GameTime(0, Date.now());
  var generator = GenomeSystem.generator(library);

  beforeEach(function () {
    for(var i=0; i<4; i++) {
      for(var j=0; j<4; j++) {
        var chromosomes = generator.next().value;
        Plant(chromosomes, i, j);
      }
    }
  });

  it('updates each growth component', function () {
    GrowthSystem.update(gametime);
    Growth.each(function (growth) {
      expect(growth.last_tick).to.be.truthy;
      expect(growth.energy).to.be.at.least(0);
    });
  });
});
