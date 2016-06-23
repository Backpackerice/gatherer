var types = [
  {
    name: 'grain',
    check: function (traits) { return traits.monocot && !traits.dicot && traits.grain; }
  },
  {
    name: 'grass',
    check: function (traits) { return traits.monocot && !traits.dicot; }
  },

  {
    name: 'tree',
    check: function (traits) { return traits.growth > 1 && traits.wood; }
  },

  {
    name: 'shrub',
    check: function (traits) { return traits.growth && traits.wood; }
  },

  {
    name: 'stalk',
    check: function (traits) { return traits.growth > 1; }
  },

  {
    name: 'herb',
    check: function () { return true; }
  }
];

module.exports = types;
