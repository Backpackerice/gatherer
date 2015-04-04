var _ = require('../vendor/lodash.js');

function Dispatcher (target) {
  var dispatcher = {};

  this.on = target ? target.on : function (triggers, fn) {
    triggers = triggers instanceof Array ? _.uniq(triggers) : [triggers];
    _.each(triggers, function (t) {
      if (dispatcher[t] === undefined) dispatcher[t] = [];
      if (dispatcher[t].indexOf(fn) === -1) dispatcher[t].push(fn);
    });
  };
  this.off = target ? target.off : function (triggers, fn) {
    triggers = triggers instanceof Array ? _.uniq(triggers) : [triggers];
    _.each(triggers, function (t) {
      if (!dispatcher[t]) return;
      if (fn) {
        var index = dispatcher[t].indexOf(fn);
        if (index > -1) dispatcher[t].splice(index, 1);
      } else {
        dispatcher[t] = []; // clear all
      }
    });
  };
  this.emit = target ? target.emit : function (triggers, data) {
    triggers = triggers instanceof Array ? _.uniq(triggers) : [triggers];
    _.each(triggers, function (t) {
        if (!dispatcher[t]) return;
        _.each(dispatcher[t], function (fn) { fn(data); });
    });
  };

  this.stopListening = function () {
    this.on = _.noop;
    this.off = _.noop;
    this.emit = _.noop;
  }
}

if (module && module.exports) module.exports = Dispatcher;
