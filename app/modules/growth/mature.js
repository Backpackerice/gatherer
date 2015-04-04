var Stage = require('./stage.js');
var Flowering = require('./flowering.js');

var Mature = module.exports = new Stage(function () {
  var terrain = this.terrain,
      traits = this.traits;
  this.roots += 0.5 * traits.root.output * (terrain.water + 0.5 * terrain.soil);
  this.stems += 0.5 * traits.stem.output * (terrain.water + terrain.soil);
  this.leaves += 0.5 * traits.leaf.output * (terrain.water + 2 * terrain.light);
  if (this.leaves + this.roots + this.stems > 20 && this.ticks > 20) return Flowering;
  return Mature;
}, 'growth-2_1');
