var _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js');

var Hunger = Component.create({
  max: 500,
  lost: 0,

  define: {
    current: function () { return Math.min(Math.max(this.max - this.lost, 0), this.max); }
  },

  constructor: function Hunger (options) {
    return this;
  },

  initialize: function () {
    this.on('hunger:consume', this.adjust.bind(this));
  },

  adjust: function (hunger) {
    console.log('hunger:', hunger);
    this.lost -= hunger;
    this.check();
  },

  tick: function (gametime) {
    if (!this.lastTick) this.lastTick = gametime;
    if (gametime.hours > this.lastTick.hours + 6) {
      this.adjust(-1);
      this.lastTick = gametime;
    }
    return this;
  },

  check: _.debounce(function () { // check on next tick
    if (this.current <= 0) this.emit('health:damage', 1);
  })
});

Hunger.update = function (time) { this.each(function (hunger) { hunger.tick(time); }); };

if (module && module.exports) module.exports = Hunger;
