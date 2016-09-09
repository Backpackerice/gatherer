
var PIXI = require('pixi.js');

var stage;
var filter;
var count = 0;
var lastTime;

function setup(container) {
  stage = container;
  filter = new PIXI.filters.ColorMatrixFilter();
  stage.filters = [filter];
}

function update(gametime) {
  if (lastTime != null && gametime.minutes === lastTime) {
    return;
  }

  count += 0.1;
  filter.hue(count);
  console.log(gametime.hour + ':' + gametime.minute);

  lastTime = gametime.minutes;
}

module.exports = {
  setup,
  update
};
