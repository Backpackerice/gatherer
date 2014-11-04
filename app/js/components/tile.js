Tile = Component.create({
  effects: {},
  nearby: [],
  constructor: function Tile (options) {
    _.extend(this, options);
    if (this.sourceEffects) {
      this.addEffects(this.sourceEffects);
      this.frame = 'tile-' + _.chain(this.sourceEffects).pairs()
          .max(function (pair) { return pair[1]; }).first().value();
    }
    return this;
  },
  addEffects: function (effects, entity) {
    var source = entity === undefined ? 'source' : entity;
    if (!this.effects[source]) this.effects[source] = {};
    _.extend(this.effects[source], effects);
    return this;
  },
  addNearby: function (tile) {
    if (!tile) return;
    this.nearby.push(tile.id);
    tile.nearby.push(this.id);
    return this;
  }
});