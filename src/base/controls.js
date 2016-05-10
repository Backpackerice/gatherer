/* 
  mapping?:
    key, context -> action
    context, action -> key

    {
      'menu': {
        key: action 
      }
    }

  limits:
    a key can only perform one action per context
    an action can be performed by multiple keys
    an action belongs to a context
*/

var _ = require('lodash');

var Controls = module.exports = function (user) {
  this.user = user;
  this.controls = {
    'menu': {},
    'overworld': {}
  };
  this.context = 'menu';

  return this;
};

Controls.prototype.load = function (json) {
  var controls = JSON.parse(json);
  _.extend(this.controls, controls);
};

Controls.prototype.export = function () {
  return JSON.stringify(this.controls);
};

Controls.prototype.setContext = function (context) {
  if (context in this.controls) this.context = context;
  return this;
};

Controls.prototype.setActionKeys = function (action, key) {
  this.controls.overworld[key] = action;
};

Controls.prototype.initialize = function () {
  // TODO: setup global listeners
};