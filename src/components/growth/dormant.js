var Stage = require('./stage.js');
var Seed = require('./seed.js');

var Dormant = module.exports = new Stage(function () {
  if (!this.terrain || !this.traits) // unplanted
    return Dormant;
  else return Seed;
}, '');
