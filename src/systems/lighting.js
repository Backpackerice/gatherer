
var PIXI = require('pixi.js');

var stage;
var filter;
var lastTime;

var markers = [
  {
    time: 1 * 60, // 1AM
    matrix: [
      0.2, 0, 0, 0, 0,
      0, 0.2, 0, 0, 0,
      0, 0, 0.6, 0, 0,
      0, 0, 0, 1, 0
    ]
  },
  {
    time: 7 * 60, // 7AM
    matrix: [
      1, 0, 0, 0, 0,
      0, 0.5, 0, 0, 0,
      0, 0, 0.75, 0, 0,
      0, 0, 0, 1, 0
    ]
  },
  {
    time: 13 * 60, // 1PM
    matrix: [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0.9, 0, 0,
      0, 0, 0, 1, 0
    ]
  },
  {
    time: 21 * 60, // 7 PM
    matrix: [
      0.5, 0, 0, 0, 0,
      0, 0.5, 0, 0, 0,
      0, 0, 0.8, 0, 0,
      0, 0, 0, 1, 0
    ]
  }
];

function setup(container) {
  stage = container;
  filter = new PIXI.filters.ColorMatrixFilter();
  stage.filters = [filter];
}

function update(gametime) {
  if (lastTime != null && gametime.minutes === lastTime) {
    return;
  }
  filter.matrix = timeToMatrix(gametime.hour * 60 + gametime.minute);
  lastTime = gametime.minutes;
}

function timeToMatrix(minutes) {
  var last = markers[markers.length - 1];
  var next = markers[0];

  markers.forEach(function (marker) {
    if (minutes > marker.time) {
      last = marker;
    }

    if (minutes < marker.time && next === marker[0]) {
      next = marker;
    }
  });

  var amt = (minutes - last.time) / (next.time - last.time);
  return interpolate(last.matrix, next.matrix, amt);
}

function interpolate(matrixA, matrixB, amt) {
  return matrixA.map(function (valA, i) {
    var valB = matrixB[i];
    var delta = valB - valA;
    return valA + delta * amt;
  });
}

module.exports = {
  setup,
  update
};
