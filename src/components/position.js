
var Component = require('../base/component2.js');

var Position = new Component({
  x: -1, // grid positions
  y: -1
});

Position.find = function (x, y) {
  return Position.filter(function (position) {
    return position.x === x && position.y === y;
  });
};

module.exports = Position;
