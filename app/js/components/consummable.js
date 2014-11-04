Consummable = Component.create({
  effects: [],
  constructor: function Consummable (options) {
    _.extend(this, options);
    this.getEffects(this.traits);
    return this;
  },

  getEffects: function (traits) {
    _.each(traits, function (value, key) {
      if (key in Effects.types)
        this.effects.push(Effects.types[key](value));
    });
  },

  consume: function (user) {
    _.each(this.effects, function (effect) {
      effect(user);
    });
    return this;
  }
});
