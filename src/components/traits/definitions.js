var _ = require('lodash');

var combine = _.curry(function (genes, geneSet) {
  var sum = function (s, num) { return s + num; },
      getGene = function (gene) { return (typeof gene === 'string') ? geneSet[gene] : gene; };
  return _.chain(genes).map(getGene).compact().reduce(sum, 0).value();
});

var definitions = {
  dud: function (g) { return _.size(g) === 0; },
  monocot: function (g) { return g.monocot && !g.dicot; },

  'color red': combine(['red']),
  'color yellow': combine(['yellow']),
  'color blue': combine(['blue']),

  'leaf poison': combine(['poison_leaf']),
  'leaf edible': combine(['edible_leaf', 1]),
  'leaf fibers': combine(['fibrous', 1]),
  'leaf output': combine(['leaf', 1]),

  'flower nectar': combine(['nectar']),
  'flower blooming': combine(['blooming']),
  'flower output': combine(['output']),

  'stem edible': combine(['edible_stem']),
  'stem fibers': combine(['fibrous', 2]),
  'stem wood': combine(['wood']),
  'stem output': combine(['stem', 1]),

  'seed fruit': combine(['fruit']),
  'seed poison': combine(['poison_seed']),
  'seed edible': combine(['edible_seed']),
  'seed fibers': combine(['fibrous', 'rind', 'bolls', 'bolls']),
  'seed output': combine(['seed', 1]),

  'root bulb': combine(['bulb']),
  'root tuber': combine(['tuber']),
  'root poison': combine(['poison_root']),
  'root edible': combine(['edible_root', 'tuber', 'tuber', 'tuber']),
  'root fibers': combine(['fibers', 2]),
  'root output': combine(['root', 1])
};

if (module && module.exports) module.exports = definitions;
