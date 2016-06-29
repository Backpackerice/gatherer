var map = {
  '37': ['moveLeft'],
  '38': ['moveUp'],
  '39': ['moveRight'],
  '40': ['moveDown']
};

var active = {};

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

module.exports = {
  setup: setup
};
