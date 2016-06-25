
var Component = require('../base/component.js');

var Sprite = new Component({
  frameset: null,
  layer: null,
  subsprites: []
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
