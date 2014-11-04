PlantGenerator = Component.create({
      constructor: function PlantGenerator (options) {
        _.extend(this, options);
        if (this.parents) this.mother = this.parents[0];
        else {
          var total = _.reduce(this.traits, function (sum, num) { return sum + num; }),
              chance = 0;
          this.chances = _.map(this.traits, function (count, trait) {
            chance += count / total;
            return {trait: trait, chance: chance};
          });
        }
        return this;
      },
      randomTrait: function () {
        var chance = Math.random(), trait = _.last(this.chances).trait;
        for (var c = 0; c < this.chances.length; c++) {
          if (chance < this.chances[c].chance) {
            trait = this.chances[c].trait;
            break;
          }
        }
        return trait;
      },
      get: function (level, ploidy) {
        var chromosomes = [];

        if (this.mother) {
          var father = _.sample(this.parents);
          chromosomes = Genome.recombine(this.mother, father);
        } else {
          level = level || Math.randInt(1, 4);
          ploidy = ploidy || 2;
          for (var cs = 0; cs < level * 4; cs++) {
            var chromosome = [];
            for (var ct = 0; ct < ploidy; ct++) {
              var traits = [];
              for (var t = 0; t < Math.randInt(0, 4 + level); t++) {
                traits.push(this.randomTrait());
              }
              chromosome.push(traits.join('.'));
            }
            chromosomes.push(chromosome);
          }
        }
        return chromosomes;
      },
      traits: {
        'growth': 10, 'red': 5, 'yellow': 5, 'blue': 5,
        'root': 3, 'stem': 3, 'leaf': 3, 'flower': 3, 'seed': 3,
        'edible_stem': 3, 'edible_seed': 3, 'edible_root': 3, 'edible_leaf': 4, 'dicot': 2,
        'monocot': 2, 'fibrous': 2, 'poison_leaf': 2, 'poison_seed': 1, 'poison_root': 1, 'blooming': 1,
        'nectar': 1, 'wood': 1, 'fruit': 1, 'rind': 1, 'staple': 1, 'bolls': 1, 'bulb': 1, 'tuber': 1
      }
    });
