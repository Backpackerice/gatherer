var _ = require('lodash');

function Entity() {
  this.id = _.uniqueId('e');
  return this;
}

Entity.prototype.set = function (Component, data) {
  var component = new Component(data);
  return component.register(this);
};

Entity.prototype.destroy = function () {
  this.destroyed = true;
};

module.exports = Entity;
