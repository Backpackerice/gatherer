
var _ = require('lodash');
var Entity = require('../base/entity.js');
var Growth = require('../components/growth.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var Genome = require('../components/genome.js');
var GenomeSystem = require('./genome.js');
var TerrainSystem = require('./terrain.js');

var types = require('./plant-types.js');

function Plant(chromosomes, x, y) {
  var terrain = TerrainSystem.get(x, y);
  if (!terrain) return;

  var plant = new Entity();
  var genome = plant.set(Genome, {chromosomes: chromosomes});
  var growth = plant.set(Growth);
  plant.set(Position, {x: x, y: y});
  plant.set(Sprite, {layer: 1});

  var expression = GenomeSystem.express(genome);
  var adjustCost = expression.counts.growth;

  growth.cost_root = growth.cost_root / adjustCost;
  growth.cost_stem = growth.cost_stem / adjustCost;
  growth.cost_leaf = growth.cost_leaf / adjustCost;
  growth.cost_flower = growth.cost_flower / adjustCost;
  growth.cost_seed = growth.cost_seed / adjustCost;

  return plant;
}

Plant.type = function (expression) {
  var traits = expression.traits;
  var counts = expression.counts;
  var output;

  _.every(types, function (type) {
    var isType = type.check(traits);
    if (isType) {
      output = type.name;
      type.bonus(traits, counts);
    }
    return !isType;
  });

  return output;
};

module.exports = Plant;
