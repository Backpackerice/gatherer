var Stage = require('./stage.js');
var Mature = require('./mature.js');

var Sprout = module.exports = new Stage(function () {
  var terrain = this.terrain,
      traits = this.traits;
  this.roots += traits.root.output * (terrain.water + 0.5 * terrain.soil);
  this.stems += traits.stem.output * (terrain.water + terrain.soil);
  this.leaves += 0.5 * traits.leaf.output * (terrain.water + 2 * terrain.light);
  if (this.leaves > 5) return Mature;
  return Sprout;
}, 'growth-1_1');