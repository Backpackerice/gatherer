var _ = require('lodash');
var Entity = require('./entity.js');
var Dispatcher = require('./dispatcher.js');

// Component Factory
// -----------------
// @param defaults    default data
// @param properties  optional object properties
//
var Component = function (defaults, properties) {
  var entities = {}; // hidden entity map
  var pool = []; // pool of destroyed components for re-use

  var eachAccepted = function (fn) {
    var accepted = Object.keys(defaults);
    accepted.forEach(fn);
  };

  // Additional functions for registering with entities.
  var prototype = {
    set: function (data) {
      data = data || {};
      eachAccepted(function (key) {
        if (key in data) {
          this[key] = data[key];
        } else if (typeof accepted === 'object') {
          this[key] = _.cloneDeep(defaults[key]);
        }
      }.bind(this));
      return this;
    },

    register: function (entity) {
      Dispatcher.call(this, entity);
      entities[entity.id] = this;
      this.entity = entity;
      if (this.initialize) this.initialize();

      return this;
    },

    unregister: function () {
      var entity = this.entity;
      this.stopListening();
      this.entity = null;
      entities[entity.id] = null;
      pool.push(this);
      return this;
    },

    toJSON: function () {
      var json = {};
      eachAccepted(function (key) {
        json[key] = this[key];
      }.bind(this));
      json.entity = this.entity;
      return json;
    }
  };

  var ComponentClass = function (data) {
    var component;
    if (pool.length) {
      component = pool.pop();
      component.set(data);
      return component;
    }

    this.set(data);
    return this;
  };

  ComponentClass.prototype = Object.create(
    _.extend(prototype, defaults),
    properties
  );

  // Static functions
  ComponentClass.get = function (eId) {
    if (eId === undefined) return entities;
    else if (eId instanceof Entity) return entities[eId.id];
    else return entities[eId];
  };

  ComponentClass.create = function (data) {
    return new this(data);
  };

  ComponentClass.each = function (fn, ctx) {
    _.each(this.get(), fn, ctx);
  };

  ComponentClass.filter = function (fn, ctx) {
    _.filter(this.get(), fn, ctx);
  };

  ComponentClass.cleanup = function () {
    this.each(function (component) {
      if (component.entity.destroyed) {
        component.unregister();
        return;
      }
    });
  };

  return ComponentClass;
};

// @alias Component
Component.create = Component;

module.exports = Component;
