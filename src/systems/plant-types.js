var types = [
  {
    name: 'grain',
    check: function (traits) {
      return traits.monocot && !traits.dicot && traits.grain; }
  },
  {
    name: 'grass',
    check: function (traits) { return traits.monocot && !traits.dicot; }
  },

  {
    name: 'tree',
    check: function (traits) { return traits.root > 2 && traits.stem > 3 && traits.wood; }
  },

  {
    name: 'shrub',
    check: function (traits) { return traits.leaf > 2 && traits.wood; }
  },

  {
    name: 'stalk',
    check: function (traits) { return traits.stem > 3; }
  },

  {
    name: 'herb',
    check: function () { return true; }
  }
];

module.exports = types;
