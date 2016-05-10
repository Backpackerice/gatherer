var _ = require('lodash'),
    Component = require('../base/component.js');

var Dormant = require('./dormant.js'),
    Dead = require('./dead.js');

var Growth = new Component({
  traits: null,
  terrain: null,

  constructor: function Growth (traits, terrain) {
    this.setTerrain(terrain);
    this.setTraits(traits);
    return this;
  },

  initialize: function () {
    this.stage = Dormant;
    this.ticks = this.cycle = this.stems = this.leaves = this.flowers = this.roots = this.seeds = 0;
    this.lastTick = null;
    return this;
  },

  setTerrain: function (terrain) {
    this.terrain = terrain;
    return this;
  },

  setTraits: function (traits) {
    this.traits = traits;
    return this;
  },

  advance: function (stage) {
    if (stage && stage !== this.stage) {
      this.stageTick = this.ticks;
      this.stage = stage;
      this.emit('growth:advance', this);
    };
    return this;
  },
  update: function (gametime) {
    if (this.stage === Dead) return;
    if (!this.lastTick) this.lastTick = gametime;

    var lastTick = this.lastTick;
    if (gametime.days > lastTick.days) {
      this.advance(this.stage.update.call(this));
      this.ticks++;
      this.lastTick = gametime;
    }
    return this;
  }
});

Growth.update = function (time) {
  var growths = this.get();
  for (var i = 0; i < growths.length; i++) { growths[i].update(time); }
};

if (module && module.exports) module.exports = Growth;
