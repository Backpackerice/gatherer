
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var PIXI = require('pixi.js');
var _ = require('lodash');

var scaleVal;
var scale;
var tileSize;
var layers;
var frames;
var pixisprites;

function setup(stage, spritesheet) {
  scaleVal = 4;
  scale = {x: scaleVal, y: scaleVal};
  tileSize = spritesheet.meta.tile * scaleVal;
  layers = [ // 4 layers
    new PIXI.Container(), // 0: terrain
    new PIXI.Container(), // 1: behind player
    new PIXI.Container(), // 2: at player
    new PIXI.Container() // 3: in front of player
  ];
  frames = parseFrames(spritesheet.frames);
  pixisprites = [];
  _.each(layers, function (layer) { stage.addChild(layer); });
}

function update() {
  Sprite.each(function (sprite, i) {
    var entity = sprite.entity;
    var position = Position.get(entity.id);

    // TODO: deal with subsprites
    var pixisprite = getPixi(i);
    var frameset = getFrame(sprite.frameset);
    var texture = PIXI.Texture.fromFrame(frameset);
    var x = position.x;
    var y = position.y;
    var baselineY = pixisprite.frame ? y + 1 - pixisprite.frame.height / Sprite.tile : y;
    var modifiedX = toPosition(x);
    var modifiedY = pixisprite ? toPosition(baselineY) : toPosition(y);
    var layer = getLayer(sprite.layer);

    if (entity.destroyed) {
      pixisprite.parent.removeChild(pixisprite);
      return;
    }

    if (pixisprite.parent) {
      pixisprite.parent.removeChild(pixisprite);
    }
    layer.addChild(pixisprite);
    pixisprite.position.set(modifiedX, modifiedY);
    pixisprite.texture = texture;
  });
}

function parseFrames(frames) {
  return _.chain(frames).map(function (frame, i) {
    frame.index = i;
    return frame;
  }).groupBy('name')
  .mapValues(function (set) {
    return _.map(set, function (frame) {
      return frame.index;
    });
  }).value();
}

function getPixi(i) {
  if (!pixisprites[i]) {
    pixisprites[i] = new PIXI.Sprite(PIXI.Texture.fromFrame(0));
    pixisprites[i].scale = scale;
  }
  return pixisprites[i];
}

function toPosition(x) {
  return x * tileSize;
}

function getFrame(frame) {
  if (_.isNumber(frame)) return frame;
  return _.sample(frames[frame]);
}

function getLayer(layer) {
  return layers[layer];
}

module.exports = {
  setup: setup,
  update: update
};
