var types = [
  {
    name: 'grass',
    check: function (traits) { return traits.monocot; },
    bonus: function (traits, genes) {
      traits.flower.output += 2;
      traits.leaf.output += 2;
      traits.seed.output += 1;
      traits.stem.output = 0;

      traits.seed.grain = traits.seed.fruit;
      traits.seed.edible += traits.seed.grain;
      if (genes.staple) {
        traits.seed.staple = traits.seed.staple * traits.seed.fruit;
        traits.seed.edible += traits.seed.staple * 2;
      }
    }
  },

  {
    name: 'tree',
    check: function (traits) { return traits.growth > 1 && traits.stem.wood; },
    bonus: function (traits, genes) {
      traits.life = 2;
      traits.large = 1;
      traits.seasonal = 1;
      traits.seed.fruit += 1;
      traits.seed.output += 2;
    }
  },

  {
    name: 'shrub',
    check: function (traits) { return traits.growth && traits.stem.wood; },
    bonus: function (traits, genes) {
      traits.life = 1;
      traits.replenishing = 2;
      traits.seed.fruit += 1;
      traits.seed.output += 1;
    }
  },

  {
    name: 'stalk',
    check: function (traits) { return traits.growth > 1; },
    bonus: function (traits, genes) {
      traits.replenishing = 1;
      traits.stem.output += traits.growth;
    }
  },

  {
    name: 'herb',
    check: function () { return true; },
    bonus: function (traits, genes) {
      traits.flower.output += 1;
      traits.leaf.output += 1;
      traits.leaf.edible += 1;
    }
  }
];

if (module && module.exports) module.exports = types;
