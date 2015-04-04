var Stage = require('./stage.js');
var Ripening = require('./ripening.js');

var Flowering = module.exports = new Stage(function () {
  var terrain = this.terrain,
      traits = this.traits;
  this.flowers += 0.5 * this.flower.output * (terrain.light + terrain.water + terrain.nutrients);
  if (this.flowers > (3 + 1.5 * traits.flower.blooming) && this.ticks - this.stageTick > 5)
    return Ripening;
  return Flowering;
}, 'growth-3_1');
