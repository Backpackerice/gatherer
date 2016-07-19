
var Position = require('../components/position.js');
var Movable = require('../components/movable.js');
var Control = require('./controls.js');

var lastTick;

function update(gametime) {
  var thisTick = gametime.realtime;
  if (!lastTick) {
    lastTick = thisTick;
  }

  var dTime = (thisTick - lastTick) / 1000;

  control();

  // Movement updates
  Movable.each(function (movable) {
    var entity = movable.entity;
    var position = Position.get(entity.id);
    var dMove = dTime * movable.speed;

    if (!position || entity.destroyed) return;

    var deltaX = movable.to_position[0] - position.x;
    var deltaY = movable.to_position[1] - position.y;

    var dX = Math.sign(deltaX) * Math.min(dMove, Math.abs(deltaX));
    var dY = Math.sign(deltaY) * Math.min(dMove, Math.abs(deltaY));

    position.x = position.x + dX;
    position.y = position.y + dY;
  });

  lastTick = thisTick;
}

function control() {
  // Update player based on controls
  var character = Control.entity();
  var active = Control.active;

  // Character control
  if (character && !character.destroyed) {
    var movable = Movable.get(character.id);
    var position = Position.get(character.id);

    if (active.moveLeft) {
      movable.to_position[0] = position.x - 1;
    }
    if (active.moveRight) {
      movable.to_position[0] = position.x + 1;
    }
    if (active.moveUp) {
      movable.to_position[1] = position.y - 1;
    }
    if (active.moveDown) {
      movable.to_position[1] = position.y + 1;
    }
  }
}

module.exports = {
  update: update
};
