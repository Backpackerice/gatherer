
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
  recombine: recombine
};
