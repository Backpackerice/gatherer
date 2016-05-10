var Stage = require('./stage.js');
var Resting = require('./resting.js');

var Ripening = module.exports = new Stage(function () {
  this.flowers = this.flowers - 1;
  this.seeds += this.traits.seed.output;
  if (Math.floor(this.flowers) <= 0) return Resting;
  return Ripening;
}, 'growth-4_1');
