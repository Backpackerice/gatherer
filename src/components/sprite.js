
var Component = require('../base/component.js');

var Sprite = new Component('sprite', {
  frameset: null,
  frameindex: 0,
  fps: 0,
  layer: null,
  subsprites: [],
  color_filter: [1, 1, 1, 1], // [r, g, b, a]
  last_tick: null
});

Sprite.Subsprite = function ({
  frameset,
  x,
  y,
  scale = 1,
  rotation = 0,
  color_filter = [1, 1, 1, 1]
}) {
  return {
    frameset,
    x,
    y,
    scale,
    rotation,
    color_filter
  };
};

module.exports = Sprite;
