var _ = require('lodash'),
    Entity = require('./entity.js'),
    Dispatcher = require('./dispatcher.js');

var Component = module.exports = function (prototype) {
  var entities = {}; // hidden entity map
  var pool = []; // pool of destroyed components for re-use

  // Prototype options
  if (prototype.define) { // Add any object definitions
    _.each(prototype.define, function (def, key) {
      var options = {};
      if (typeof def === 'object') _.extend(options, def);
      else if (typeof def === 'function') options.get = def;
      else options.value = def;

      Object.defineProperty(prototype, key, options);
    });
    delete prototype.define;
  }

  var proto = {
    register: function (entity) {
      Dispatcher.call(this, entity);
      entities[entity.id] = this;
      this.entity = entity;
      if (this.initialize) this.initialize();

      this.on('destroy', this.destroy);
      return this;
    },
    destroy: function () {
      this.stopListening();
      this.entity = null;
      entities[entity.id] = null;
      pool.push(this);
      return this;
    }
  };

  var component = prototype.constructor;
  component.prototype = _.extend(prototype, proto);

  // General component management
  component.get = function (eId) {
    if (eId === undefined) return entities;
    else if (eId instanceof Entity) return entities[eId.id];
    else return entities[eId];
  };
  component.create = function () {
    var component;
    if (pool.length) component = pool.pop();
    else component = new this();

    this.prototype.constructor.apply(component, arguments);
    return component;
  };

  component.each = function (fn, ctx) { _.each(this.get(), fn, ctx); };
  component.filter = function (fn, ctx) { _.filter(this.get(), fn, ctx); };

  return component;
};

Component.create = function (proto) { return new this(proto); };
