var _ = require('lodash'),
    Component = require('../../base/component.js');

var Position = module.exports = new Component({
  constructor: function Position (x, y, duration) {
    this.x = _.isUndefined(x) ? -1 : x;
    this.y = _.isUndefined(y) ? -1 : y;
    this.duration = duration || 0;
    this.move(x, y, duration);
    this.lastTick = null;
    return this;
  },

  move: function (x, y, duration) {
    this.x = x;
    this.y = y;
    this.duration = duration;
    if (this.entity) this.emit('position:moveStart', this);
    return this;
  },

  tick: function (gametime) {
    var time = gametime.realtime;
    if (this.duration > 0) {
      if (!this.lastTick) this.lastTick = gametime;
      this.duration = this.duration - (gametime.realtime - this.lastTick.realtime);
      if (this.duration <= 0) this.emit('position:move', this);
      this.lastTick = gametime;
    } else if (this.lastTick !== null) this.lastTick = null;
    return this;
  }
});

Position.update = function (time) {
  var positions = this.get();
  for (var i = 0; i < positions.length; i++) { positions[i].tick(time); }
};

Position.find = function (x, y) {
  this.filter(function (position) {
    return position.x === x && position.y === y;
  });
};
