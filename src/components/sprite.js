
var Component = require('../base/component.js');

var Sprite = new Component({
  frameset: null,
  frameindex: 0,
  fps: 0,
  layer: null,
  subsprites: [],
  last_tick: null
});

Sprite.Subsprite = function (frameset, x, y) {
  return {
    frameset: frameset,
    x: x,
    y: y
  };
};

module.exports = Sprite;
