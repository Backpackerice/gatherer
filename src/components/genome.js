
var Component = require('../base/component.js');

var Genome = new Component('genome', {
  chromosomes: [[]]
}, {
  ploidy: {
    get: function () {
      return this.chromosomes.length && this.chromosomes[0].length;
    }
  }
});

module.exports = Genome;
