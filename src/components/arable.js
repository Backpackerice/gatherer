//var _ = require('lodash');
var Component = require('../base/component.js');

var Arable = new Component('arable', {
  water: 0,
  nutrients: 0,
  light: 0,
  planted: false
});

module.exports = Arable;
