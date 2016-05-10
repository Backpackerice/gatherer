var _ = require('lodash'),
    Component = require('../base/component.js'),
    GameTime = require('../base/time.js');

var Effects = Component.create({
  constructor: function Effect () { return this; },
  initialize: function () {
    this.on('effect:poison', this.getPoisonTick.bind(this));
  },

  tick: function (time) {
    _.each(this.ticks, function (tick) { tick(time); });
  },

  getPoisonTick: function (amount) {
    var onTick = function () { this.emit('health:damage', amount); };
    this.createTick(GameTime.MINUTE * 5, amount, onTick.bind(this));
  },

  createTick: function (duration, maxTicks, fn) {
    var ticks = this.ticks,
        lastTick = new GameTime(),
        tickTime = duration / maxTicks,
        numTicks = 0,
        tick = function (time) {
          if (time.time - lastTick.time > tickTime) {
            fn();
            numTicks++;
            lastTick = time;
            if (numTicks === maxTicks) {
              var index = ticks.indexOf(fn);
              if (index > -1) ticks.splice(index, 1);
            }
          }
        };
    this.ticks.push(tick);
    return tick;
  }
});

Effects.types = require('./types.js');

Effects.update = function (time) { this.each(function (effect) { effect.tick(time); }); };

if (module && module.exports) module.exports = Effects;
