
var _ = require('lodash');
var Entity = require('../base/entity.js');
var Growth = require('../components/growth.js');
var Position = require('../components/position.js');
var Sprite = require('../components/sprite.js');
var Genome = require('../components/genome.js');
var GenomeSystem = require('./genome.js');

function Plant(chromosomes, x, y) {
  var plant = new Entity();
  var genome = plant.set(Genome, {chromosomes: chromosomes});
  var growth = plant.set(Growth);
  plant.set(Position, {x: x, y: y});
  plant.set(Sprite, {fps: 1, layer: 1});

  var expression = GenomeSystem.express(genome);

  Plant.define('growth', growth, expression);
  return plant;
}

Plant.define = function (key, component, expression) {
  var definitions = require('./plant-definitions.js');
  var definition = definitions[key];
  var value;
  for (var attr in definition) {
    value = component[attr];
    component[attr] = definition[attr](value, expression);
  }
};

Plant.type = function (expression) {
  var types = require('./plant-types.js');
  var traits = expression.traits;
  var counts = expression.counts;
  var output;

  _.every(types, function (type) {
    var isType = type.check(traits, counts);
    if (isType) {
      output = type.name;
    }
    return !isType;
  });

  return output;
};

module.exports = Plant;
