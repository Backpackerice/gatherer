Inventory = Component.create({
  size: 32,
  equipment: {HEAD: 0, BODY: 1, LEGS: 2, LHAND: 3, RHAND: 4}, //equipment slots

  constructor: function Inventory (options) {
    _.extend(this, options);
    this.bins = new Array(this.size);
    this.items = {};
    return this;
  },

  addItem: function (e, bin) {
    var replaced;
    if (bin === undefined) {
      for (var i = 5; i < this.size; i++) { // start at first slot that's not an equipment slot
        if (this.bins[i] === undefined) { // find next available
          bin = i;
          break;
        }
      }
      if (bin === undefined) return e; // inventory is full
    }

    replaced = this.bins[bin];
    this.bins[bin] = e;

    this.items[e] = bin;
    if (replaced) delete this.items[replaced];
    return replaced;
  },

  removeItem: function (bin) { if (bin) return this.addItem(undefined, bin); }
});
