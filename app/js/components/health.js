Health = Component.create({
  max: 10,
  lost: 0,

  define: {
    current: {
      get: function () {
        return this.max - this.lost;
      },
      enumerable: true
    }
  },

  constructor: function Health (options) {
    _.extend(this, options);
    return this;
  },

  initialize: function () {
    this.on('hunger', function () { this.adjust(-1); });
    this.on('poison', this.adjust.bind(this));
  },

  adjust: function (health) {
    this.lost -= health;
    this.check();
  },

  check: _.debounce(function () { // check on next tick
    if (this.current <= 0) this.emit('health:death');
  })
});
