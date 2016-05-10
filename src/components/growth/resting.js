var Stage = ('./stage.js');
var Mature = require('./mature.js');

var Resting = module.exports = new Stage(function () {
  var next = Resting,
      replenish = Math.random() > 0.66,
      traits = this.traits;

  if (replenish && (this.cycle < traits.replenishing + traits.life || traits.life > 1)) {
    if (traits.replenishing) next = Mature;
    if (traits.seasonal && !isNaN((this.ticks - this.stageTick) % 24)) next = Mature;
  }
  if (next !== Resting) { growth.cycle++; }
  return next;
}, 'growth-4_1');
