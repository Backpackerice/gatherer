
var Position = require('../components/position.js');
var Movable = require('../components/movable.js');

var lastTick;

function update(gametime) {
  var thisTick = gametime.realtime;
  if (!lastTick) {
    lastTick = thisTick;
  }

  var dTime = (thisTick - lastTick) / 1000;

  Movable.each(function (movable) {
    var entity = movable.entity;
    var position = Position.get(entity.id);
    var dMove = dTime * movable.speed;
    var sum = Math.abs(movable.direction[0]) + Math.abs(movable.direction[1]);

    if (!position || entity.destroyed) return;

    if (sum) {
      var dX = movable.direction[0] * dMove / Math.sqrt(sum);
      var dY = movable.direction[1] * dMove / Math.sqrt(sum);
      position.x = position.x + dX;
      position.y = position.y + dY;
    }
  });
}

module.exports = {
  update: update
};
