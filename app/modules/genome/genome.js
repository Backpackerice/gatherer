var _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js'),
    randInt = require('../helpers/randInt.js');

var Genome = module.exports = new Component({
  define: {
    ploidy: function () {
      return this.chromosomes.length === 0 ? 0 : this.chromosomes[0].length;
    }
  },

  constructor: function Genome (options) {
    this.chromosomes = options.chromosomes ? options.chromosomes : [];
    return this;
  },

  meiosis: function () {
    var zygote = [];
    if (this.ploidy % 2 === 0) {
      this.chromosomes.forEach(function (chromosome) {
        var c = _.clone(chromosome);
        for (var i = 0; i < chromosome.length / 2; i++) {
          var chromatid = c.splice(randInt(0, c.length), 1);
          zygote.push(chromatid[0]);
        }
      });
    }
    return zygote;
  },
  
  express: function () {
    var counts = [], traits = {};
    _.each(this.chromosomes, function (chromosome, i) {
      var ts = [], c = {};
      _.each(chromosome, function (chromatid) { ts = ts.concat(chromatid.split('.'));});
      _.each(ts, function (t) { c[t] = c[t] ? c[t] + 1 : 1; });
      counts.push(c);
    });
    counts.push(function (a, b) { return (a > b) ? a : b; });
    traits = _.merge.apply(this, counts);
    return traits;
  }
});

Genome.recombine = function (eId1, eId2) {
  var g1 = this.get(eId1), g2 = this.get(eId2),
      chromosomes = [];
  if (g1.chromosomes.length === g2.chromosomes.length) {
    chromosomes = _.zip(g1.meiosis(), g2.meiosis());
    _.remove(chromosomes, function (chromosome) { return chromosome.length === 0; });
  }
  return chromosomes;
};
          