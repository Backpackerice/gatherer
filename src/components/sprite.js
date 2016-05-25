
var Component = require('../base/component2.js');

var Sprite = new Component({
  frameset: null,
  layer: null,
  subsprites: [],
  x: 0, // grid positions
  y: 0
});

Sprite.addSubsprite = function (sprite, frameset, x, y, index) {
  sprite[index] = {
    frameset: frameset,
    x: y,
    y: y
  };
  return sprite;
};

module.exports = Sprite;
