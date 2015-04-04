var _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js');

var Useable = module.exports = new Component({
  constructor: function Useable (onUse, count) {
    this.count = _.isUndefined(count) ? Infinity : count;
    this.onUse = _.isUndefined(onUse) ? _.noop : _.curry(onUse);
    return this;
  },

  initialize: function () {
    this.onUse = this.onUse(this.entity);
  },

  use: function () {
    if (this.count <= 0) return;
    var result = this.onUse.apply(this, arguments);
    if (result) this.count--;
    return result;
  }
});
