var Stage = require('./stage.js');
var Sprout = require('./sprout.js');

var Seed = module.exports = new Stage(function () {
  var terrain = this.terrain,
      traits = this.traits;
  if (this.roots > 0 || terrain.nutrients + terrain.water > 0.6)
    this.roots += traits.root.output * (terrain.water + terrain.nutrients);
  if (this.roots > 4) return Sprout;
  return Seed;
}, 'growth-0_1');
