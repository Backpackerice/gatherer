
var Component = require('../base/component.js');

var Sprite = new Component('sprite', {
  frameset: null,
  frameindex: 0,
  fps: 0,
  layer: null,
  subsprites: [],
  last_tick: null
});

Sprite.Subsprite = function ({ frameset, x, y, scale = 1, rotation = 0 }) {
  return {
    frameset,
    x,
    y,
    scale,
    rotation
  };
};

module.exports = Sprite;
