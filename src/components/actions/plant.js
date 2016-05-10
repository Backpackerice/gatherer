var Genome = require('../genome/genome.js'),
    Position = require('../position/position.js'),
    Traits = require('../traits/traits.js'),
    Growth = require('../growth/growth.js'),
    Terrain = require('../terrain/terrain.js'),
    Sprite = require('../sprite/sprite.js');

var plant = module.exports = function (e, x, y) {
  var genome = Genome.get(e); // entity must have a genome to be planted
  if (genome) return updatePlantEntity(e, genome);
  return false;
};

var updatePlantEntity = function (e, genome) {
  var traits = Traits.create(genome.express()).register(e);
  var position = Position.create(x, y).register(e);
  var terrain = Terrain.getAtXY(position.x, position.y);
  var growth = Growth.create(traits, terrain).register(e);
  var sprite = Sprite.create().register(e);

  var onGrowthAdvance = function () { sprite.setFrameSet(growth.stage.frameSet); };

  sprite.setLayer(1);
  sprite.setXY(position.x, position.y); // should not move
  sprite.on('growth:advance', _.bind(onGrowthAdvance));
  return true;
};
