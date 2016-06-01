
var Position = require('../components/position.js');
var Movable = require('../components/movable.js');

var lastTick;

function update(gametime) {
  var thisTick = gametime.realtime;
  if (!lastTick) {
    lastTick = thisTick;
  }

  var dTime = thisTick - lastTick;

  Movable.each(function (movable) {
    var entity = movable.entity;
    var position = Position.get(entity.id);
    var dMove = dTime * movable.speed;

    if (!position || entity.destroyed) return;

    if (movable.moving) {
      var dX = (movable.moving - 2) % 2 * dMove;
      var dY = (movable.moving - 3) % 2 * dMove;
      position.x = position.x + dX;
      position.y = position.y + dY;
    }
  });
}

module.exports = {
  update: update
};
