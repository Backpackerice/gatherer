
var Component = require('../base/component.js');

var Movable = new Component({
  direction: [0, 0],
  speed: 0 // base speed in tiles per second
});

module.exports = Movable;
