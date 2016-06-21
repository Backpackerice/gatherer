var types = [
  {
    name: 'grass',
    check: function (traits) { return traits.monocot && !traits.dicot; },
    bonus: function (traits) {
      traits.flower += 2;
      traits.leaf += 2;
      traits.seed += 1;
      traits.stem = 0;

      traits.grain = traits.fruit;
      traits.edible += traits.grain;
      if (traits.staple) {
        traits.staple = traits.staple * traits.fruit;
        traits.edible_seed += traits.staple * 2;
      }
    }
  },

  {
    name: 'tree',
    check: function (traits) { return traits.growth > 1 && traits.wood; },
    bonus: function (traits) {
      traits.life = 2;
      traits.large = 1;
      traits.seasonal = 1;
      traits.fruit += 1;
      traits.seed += 2;
    }
  },

  {
    name: 'shrub',
    check: function (traits) { return traits.growth && traits.wood; },
    bonus: function (traits) {
      traits.life = 1;
      traits.replenishing = 2;
      traits.fruit += 1;
      traits.seed += 1;
    }
  },

  {
    name: 'stalk',
    check: function (traits) { return traits.growth > 1; },
    bonus: function (traits) {
      traits.replenishing = 1;
      traits.stem += traits.growth;
    }
  },

  {
    name: 'herb',
    check: function () { return true; },
    bonus: function (traits) {
      traits.flower += 1;
      traits.leaf += 1;
      traits.edible_leaf += 1;
    }
  }
];

module.exports = types;
