var _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js'),
    EffectTypes = require('../effects/types.js');

var Consummable = new Component({
  constructor: function Consummable (options) {
    _.extend(this, options);
    this.effects = [];
    this.getEffects(options);
    return this;
  },

  getEffects: function (traits) {
    _.each(traits, function (value, key) {
      if (value && key in EffectTypes)
        this.effects.push(EffectTypes[key](value));
    }.bind(this));
  },

  consume: function (user) {
    _.each(this.effects, function (effect) {
      effect(user);
    }.bind(this));
    return this;
  }
});

if (module && module.exports) module.exports = Consummable;
