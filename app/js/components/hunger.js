Hunger = Component.create({
  max: 100,
  lost: 0,

  define: {
    current: {
      get: function () {
        return Math.min(Math.max(this.max - this.lost, 0), this.max);
      },
      enumerable: true
    }
  },

  constructor: function Hunger (options) {
    _.extend(this, options);
    return this;
  },

  initialize: function () {
    this.on('hunger:consume', this.adjust.bind(this));
  },

  adjust: function (health) {
    this.lost -= health;
    this.check();
  },

  tick: function (gametime) {
    if (!this.lastTick) this.lastTick = new GameTime();
    if (gametime.hours > this.lastTick.hours) {
      this.adjust(-1);
      this.lastTick = gametime;
    }
    return this;
  },

  check: _.debounce(function () { // check on next tick
    if (this.current <= 0) this.emit('hunger');
  })
});

Hunger.tick = function () {
  var time = new GameTime();
  this.each(function (hunger) { hunger.tick(time); });
};

Game.registerTick(Hunger);
