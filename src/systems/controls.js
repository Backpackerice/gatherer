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

function entity(entity) {
  if (entity) {
    character = entity;
  }
  return character;
}

module.exports = {
  active: active,
  setup: setup,
  entity: entity
};
