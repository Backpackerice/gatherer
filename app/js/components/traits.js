Traits = Component.create({
      constructor: function Traits (options) {
        _.extend(this, options)
        this.parse(this.traits);
        return this;
      },
      parse: function (traits) {
        if (_.size(traits) === 0) {
          this.dud = true;
          return this;
        }
        
        this.monocot = traits.monocot && !traits.dicot ? true : false;
        this.growth = traits.growth ? traits.growth : 0;
        this.colors = {
          red: traits.red ? traits.red : 0,
          yellow: traits.yellow ? traits.yellow : 0,
          blue: traits.blue ? traits.blue : 0
        };
        this.leaf = {
          poison: traits.poison_leaf ? traits.poison_leaf : false,
          edible: traits.edible_leaf ? traits.edible_leaf : false,
          fibers: _.chain([traits.fibrous, 1]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          output: traits.leaf ? traits.leaf + 1 : 1
        };
        this.flower = {
          nectar: traits.nectar ? traits.nectar : false,
          blooming: traits.blooming ? traits.blooming : 0,
          output: traits.flower ? traits.flower + 1 : 1
        };
        this.stem = {
          edible: traits.edible_stem ? traits.edible_stem : false,
          fibers: _.chain([traits.fibrous, 2]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          wood: traits.wood ? traits.wood : false,
          output: traits.stem ? traits.stem + 1 : 1
        };
        this.seed = {
          fruit: traits.fruit ? traits.fruit : false,
          grain: traits.fruit && this.monocot ? traits.fruit : false,
          staple: traits.fruit && this.monocot && traits.staple ? traits.staple : false,
          poison: traits.poison_seed ? traits.poison_seed : false,
          edible: _.chain([traits.edible_seed * 0.5, traits.fruit, traits.grain, traits.staple * 2]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          fibers: _.chain([traits.fibrous, traits.rind, traits.bolls * 2]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          output: traits.seed ? traits.seed + 1 : 1
        };
        this.root = {
          bulb: traits.bulb ? traits.bulb : false,
          tuber: traits.tuber ? traits.tuber : false,
          poison: traits.poison_root ? traits.poison_root : false,
          edible: _.chain([traits.edible_root * 0.5, traits.tuber * 2]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          fibers: _.chain([traits.fibrous, 2]).compact()
              .reduce(function (sum, num) { return sum + num; }).value(),
          output: traits.root ? traits.root + 1 : 1
        };
        return this.typing();
      },
      typing: function () {
        if (this.monocot) {
          this.flower.output += 2;
          this.leaf.output += 2;
          this.seed.output += 1;
          this.stem.output = 0;
          this.type = 'grass';
        }
        else if (this.growth > 1 && this.stem.wood) { // trees
          this.life = 2;
          this.large = 1;
          this.seasonal = 1;
          this.seed.fruit += 1;
          this.seed.output += 2;
          this.type = 'tree';
        }
        else if (this.growth && this.stem.wood) { // shrubs
          this.life = 1;
          this.replenishing = 2;
          this.seed.fruit += 1;
          this.seed.output += 1;
          this.type = 'shrub';
        }
        else if (this.growth > 1) { // stalk
          this.replenishing = 1;
          this.stem.output += this.growth;
          this.type = 'stalk';
        }
        else { // herbs
          this.flower.output += 1;
          this.leaf.output += 1;
          this.leaf.edible += 1;
          this.type = 'herb';
        }
        return this;
      }
    });
