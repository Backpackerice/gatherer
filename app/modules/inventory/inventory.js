var _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js');

var Inventory = Component.create({
  size: 32,
  equipment: ['head', 'body', 'legs', 'lhand', 'rhand'], //equipment slots

  constructor: function Inventory (options) {
    this.bins = new Array(this.size);
    return this;
  },

  addItem: function (e, bin) {
    var replaced;
    if (bin === undefined) {
      var full = _.every(this.bins, function (item, slot) { // search for the next available slot
        var isFilled = item || slot in this.equipment; // ignore equipment slots
        if (!isFilled) bin = slot;
        return isFilled; // breaks on first empty slot
      }, this);

      if (full) return e; // inventory full
    }

    replaced = this.bins[bin];
    this.bins[bin] = e;
    return replaced;
  },

  removeItem: function (bin) { if (bin) return this.addItem(undefined, bin); }
});

if (module && module.exports) module.exports = Inventory;
