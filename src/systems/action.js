var Control = require('./controls.js');
var ActionPlant = require('./action-plant');

var actionMap = {
  'plant': ActionPlant.perform
};

function update() {
  var active = Control.active;
  var character = Control.entity();

  // Character control
  if (character && !character.destroyed) {
    actionMap.forEach(function (perform, key) {
      if (active[key]) perform(character);
    });
  }
}

module.exports = {
  update: update
};
