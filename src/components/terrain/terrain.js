var _ = require('lodash'),
    Component = require('../../base/component.js');

var pairing = require('../../helpers/pairing.js');

var Terrain = module.exports = new Component({
  constructor: function (water, nutrients) {
    if (_.isUndefined(water)) this.water = water || Math.random();
    if (_.isUndefined(nutrients)) this.nutrients = nutrients || Math.random();
    this.light = Math.random();
    return this;
  }
});

Terrain.tiles = {};
Terrain.generate = require('./generate.js');
Terrain.getAtXY = function (x, y) { return this.tiles[pairing(x, y)]; };