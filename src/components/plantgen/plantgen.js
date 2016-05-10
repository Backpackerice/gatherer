var _ = require('lodash'),
    Component = require('../../base/component.js'),
    randInt = require('../../helpers/randInt.js');

var Genome = require('../genome/genome.js');

var PlantGenerator = Component.create({
  constructor: function PlantGenerator (options) {
    _.extend(this, options);
    if (this.parents) this.mother = this.parents[0];
    else {
      var total = _.reduce(this.genes, function (sum, num) { return sum + num; }),
          chance = 0;
      this.chances = _.map(this.genes, function (count, gene) {
        chance += count / total;
        return {gene: gene, chance: chance};
      });
    }
    return this;
  },
  randomGene: function () {
    var chance = Math.random(), gene = _.last(this.chances).gene;
    for (var c = 0; c < this.chances.length; c++) {
      if (chance < this.chances[c].chance) {
        gene = this.chances[c].gene;
        break;
      }
    }
    return gene;
  },
  get: function (level, ploidy) {
    var chromosomes = [];

    if (this.mother) {
      var father = _.sample(this.parents);
      chromosomes = Genome.recombine(this.mother, father);
    } else {
      level = level || randInt(1, 4);
      ploidy = ploidy || 2;
      for (var cs = 0; cs < level * 4; cs++) {
        var chromosome = [];
        for (var ct = 0; ct < ploidy; ct++) {
          var genes = [];
          for (var t = 0; t < randInt(0, 4 + level); t++) {
            genes.push(this.randomGene());
          }
          chromosome.push(genes.join('.'));
        }
        chromosomes.push(chromosome);
      }
    }
    return chromosomes;
  },
  genes: require('../genome/genome.library.js')
});

if (module && module.exports) module.exports = PlantGenerator;
