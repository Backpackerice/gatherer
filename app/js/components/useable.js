Useable = Component.create({
  count: Infinity,
  constructor: function Useable (options) {
    _.extend(this, options);
    return this;
  },

  use: function (callback) {
    if (this.count <= 0) return;
    var result = callback(this.entity);
    if (result) this.count--;
    return result;
  }
});
