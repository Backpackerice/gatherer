
var Component = require('../base/component.js');

var Movable = new Component({
  to_position: [-1, -1],
  speed: 0 // base speed in tiles per second
});

module.exports = Movable;
