var _ = require('lodash'),
    Dispatcher = require('./dispatcher.js');

function Entity (components) {
  Dispatcher.call(this);
  this.id = _.uniqueId('e');

  _.each(components, function (component) {
    component.register(this);
  }.bind(this));

  return this;
}

Entity.prototype.destroy = function () { this.emit('destroy'); }

if (module && module.exports) module.exports = Entity;
