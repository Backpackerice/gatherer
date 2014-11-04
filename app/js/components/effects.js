Effects = Component.create({
  constructor: function Effect () { return this; },
  initialize: function () {
    this.on('effect:poison', this.getPoisonTick.bind(this));
  },

  tick: function (time) {
    _.each(this.ticks, function (tick) { tick(time); });
  },

  getPoisonTick: function (amount) {
    var onTick = function () { this.emit('poison', amount); };
    this.createTick(GameTime.MINUTE * 5, amount, onTick);
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

Effects.types = {
  edible: function (level) {
    return function (entity) {
      if (level) entity.emit('hunger:consume', level);
    };
  },
  poison: function (level) {
    return function (entity) {
      if (level) entity.emit('effect:poison', level);
    };
  }
}

Effects.tick = function () {
  var time = new GameTime();
  this.each(function (effect) { effect.tick(time); });
};
