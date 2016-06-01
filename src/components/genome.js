
var Component = require('../base/component2.js');

var Genome = new Component({
  chromosomes: [[]]
}, {
  ploidy: {
    get: function () {
      return this.chromosomes.length && this.chromosomes[0].length;
    }
  }
});

module.exports = Genome;
