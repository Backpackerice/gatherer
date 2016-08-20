var _ = require('lodash');

function Entity() {
  this.id = _.uniqueId('e');
  this.destroyed = false;
  return this;
}

Entity.prototype.set = function (ComponentClass, data) {
  var component = new ComponentClass(data);
  return component.register(this);
};

Entity.prototype.get = function (ComponentClass) {
  return ComponentClass.get(this.id);
};

Entity.prototype.destroy = function () {
  this.destroyed = true;
};

Entity.prototype.toJSON = function () {
  var Component = require('./component.js');
  var components = Component.map;
  var output = {
    id: this.id,
    destroyed: this.destroyed
  };

  components.forEach(function (ComponentClass, name) {
    var component = ComponentClass.get(output.id);
    if (component) output[name] = component;
  });

  return output;
};

module.exports = Entity;
