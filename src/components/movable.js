
var Component = require('../base/component.js');

var Movable = new Component({
  moving: 0,  // Movable.STILL
  speed:  0   // base speed in tiles per second
});

Movable.STILL = 0;
Movable.LEFT  = 1;
Movable.UP    = 2;
Movable.RIGHT = 3;
Movable.DOWN  = 4;

module.exports = Movable;
