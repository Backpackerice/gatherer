
var PIXI = require('pixi.js');

var stage;
var filter;
var count = 0;

function setup(container) {
  stage = container;
  filter = new PIXI.filters.ColorMatrixFilter();
  stage.filters = [filter];
}

function update() {
  count += 0.1;
  filter.hue(count);
}

module.exports = {
  setup,
  update
};
