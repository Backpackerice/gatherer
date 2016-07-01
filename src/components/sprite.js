
var Component = require('../base/component.js');

var Sprite = new Component({
  frameset: null,
  layer: null,
  subsprites: []
});

Sprite.Subsprite = function (frameset, x, y) {
  return {
    frameset: frameset,
    x: x,
    y: y
  };
};

module.exports = Sprite;
