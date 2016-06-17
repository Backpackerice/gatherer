
var _ = require('lodash');
var random = require('../base/random.js');

function meiosis(genome) {
  var zygote = [];
  if (genome.ploidy % 2 === 0) {
    genome.chromosomes.forEach(function (chromosome) {
      var c = _.clone(chromosome);
      for (var i = 0; i < chromosome.length / 2; i++) {
        var chromatid = c.splice(random.int(0, c.length), 1);
        zygote.push(chromatid[0]);
      }
    });
  }
  return zygote;
}

function recombine(genome1, genome2) {
  var chromosomes = [];
  if (genome1.chromosomes.length === genome2.chromosomes.length) {
    chromosomes = _.zip(meiosis(genome1), meiosis(genome2));
    _.remove(chromosomes, function (chromosome) { return chromosome.length === 0; });
  }
  return chromosomes;
}

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
  traits = _.mergeWith.apply(null, mergeCounts); // check
  return {
    traits: traits,
    counts: counts
  };
}

function* generator(library, level, ploidy, count) {
  // Generates random chromosomes given a library of genes with the
  // keys as the gene and the value as an adjustable chance weight.
  count = count || 99;
  level = level || random.int(1, 4);
  ploidy = ploidy || 2;
  var index = 0;
  var chance = 0;
  var total = _.reduce(library, function (sum, num) { return sum + num; });
  var chances = _.map(library, function (count, gene) {
    chance += count / total;
    return {gene: gene, chance: chance};
  });
  var chromosomes;
  var randomGene = function () {
    var chance = random.random(), gene = _.last(chances).gene;
    for (var c = 0; c < chances.length; c++) {
      if (chance < chances[c].chance) {
        gene = chances[c].gene;
        break;
      }
    }
    return gene;
  };

  while(index < count) {
    chromosomes = [];
    for (var cs = 0; cs < level * 4; cs++) {
      var chromosome = [];
      for (var ct = 0; ct < ploidy; ct++) {
        var chromatid = [];
        for (var t = 0; t < random.int(0, 4 + level); t++) {
          chromatid.push(randomGene());
        }
        chromosome.push(chromatid.join('.'));
      }
      chromosomes.push(chromosome);
    }
    index++;
    yield chromosomes;
  }
}

function* nursery(mother, father, count) {
  count = count || 99;
  var index = 0;
  while(index < count) {
    index++;
    yield recombine(mother, father);
  }
}

module.exports = {
  meiosis: meiosis,
  recombine: recombine,
  express: express,
  generator: generator,
  nursery: nursery
};
