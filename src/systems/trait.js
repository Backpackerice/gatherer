var _ = require('lodash');
var types = require('./trait-types.js');
var definitions = require('./trait-definitions.js');

// TODO: reduce complexity of setting expressions and traits
// Maybe make traits set up components instead
// Should also reduce the duplication of concerns in the plant creator
function express(genome) {
  var counts = [];
  var traits = {};
  _.each(genome.chromosomes, function (chromosome) {
    var ts = [], c = {};
    _.each(chromosome, function (chromatid) { ts = ts.concat(chromatid.split('.'));});
    _.each(ts, function (t) { c[t] = c[t] ? c[t] + 1 : 1; });
    counts.push(c);
  });

  var mergeCounts = _.cloneDeep(counts);
  mergeCounts.push(function (a, b) { return (a > b) ? a : b; });
  traits = _.mergeWith.apply(null, mergeCounts);
  return {
    traits: traits,
    counts: counts
  };
}

function type(genome) {
  var expression = express(genome);
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
}

function define(genome) {
  var expression = express(genome);
  var output = {};
  var traits = expression.traits;

  _.each(definitions, setTrait);

  function setTrait (def, key) {
    var names = key.split(' ');
    var name = names[0];
    if (names.length > 1) {
      if (!output[name]) output[name] = {};
      setTrait.call(output[name], def, names[1]);
    } else output[name] = def(traits);
  }
  return output;
}

module.exports = {
  type: type,
  define: define,
  express: express
};
