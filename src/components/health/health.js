var _ = require('lodash'),
    Component = require('../base/component.js');

var Health = Component.create({
  max: 10,
  lost: 0,
  dead: false,

  define: {
    current: function () { return this.max - this.lost; }
  },

  constructor: function Health (options) {
    return this;
  },

  initialize: function () {
    this.on('health:damage', this.damage.bind(this));
    this.on('health:heal', this.heal.bind(this));
  },

  heal: function (health) { this.adjust(health); },

  damage: function (health) { this.adjust(-health); },

  adjust: function (health) {
    this.lost -= health;
  },

  tick: function (time) {
    if (this.current <= 0 && !this.dead) {
      this.dead = true;
      this.emit('death');
    }
  }
});

Health.update = function (time) { this.each(function (health) { health.tick(time); }); }

if (module && module.exports) module.exports = Health;
