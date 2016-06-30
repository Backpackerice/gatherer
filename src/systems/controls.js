var map = {
  '37': ['moveLeft'],
  '38': ['moveUp'],
  '39': ['moveRight'],
  '40': ['moveDown']
};

var active = {};
var character;

function setup(el) {
  el.addEventListener('keydown', function (e) {
    activate(map[e.keyCode]);
  });

  el.addEventListener('keyup', function (e) {
    deactivate(map[e.keyCode]);
  });
}

function activate(actions) {
  if (!actions) return;
  actions.forEach(function (action) {
    active[action] = true;
  });
}

function deactivate(actions) {
  if (!actions) return;
  actions.forEach(function (action) {
    active[action] = null;
  });
}

function control(entity) {
  character = entity;
}

function update() {
  if (!character || character.destroyed) return;
  var Movable = require('../components/movable.js');
  var movable = Movable.get(character.id);

  movable.direction = [0, 0]; // reset
  if (active.moveLeft) {
    movable.direction[0] -= 1;
  }
  if (active.moveRight) {
    movable.direction[0] += 1;
  }
  if (active.moveUp) {
    movable.direction[1] -= 1;
  }
  if (active.moveDown) {
    movable.direction[1] += 1;
  }
}

module.exports = {
  active: active,
  setup: setup,
  control: control,
  update: update
};
