//var _ = require('lodash');
var Component = require('../base/component.js');

var Resource = new Component('resource', {
  water_level: 0,
  water_range: 0
});

module.exports = Resource;
