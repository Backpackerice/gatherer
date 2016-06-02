
var _ = require('lodash');
var randInt = require('../helpers/randInt.js');

function meiosis(genome) {
  var zygote = [];
  if (genome.ploidy % 2 === 0) {
    genome.chromosomes.forEach(function (chromosome) {
      var c = _.clone(chromosome);
      for (var i = 0; i < chromosome.length / 2; i++) {
        var chromatid = c.splice(randInt(0, c.length), 1);
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

function* generator(library, level, ploidy, count) {
  // Generates random chromosomes given a library of genes with the
  // keys as the gene and the value as an adjustable chance weight.
  count = count || 99;
  level = level || randInt(1, 4);
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
    var chance = Math.random(), gene = _.last(chances).gene;
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
        for (var t = 0; t < randInt(0, 4 + level); t++) {
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

// TODO: gene expression
// express: function () {
//   var counts = [], traits = {};
//   _.each(this.chromosomes, function (chromosome, i) {
//     var ts = [], c = {};
//     _.each(chromosome, function (chromatid) { ts = ts.concat(chromatid.split('.'));});
//     _.each(ts, function (t) { c[t] = c[t] ? c[t] + 1 : 1; });
//     counts.push(c);
//   });
//   counts.push(function (a, b) { return (a > b) ? a : b; });
//   traits = _.merge.apply(this, counts);
//   return traits;
// }

module.exports = {
  meiosis: meiosis,
  recombine: recombine,
  generator: generator,
  nursery: nursery
};