
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var PIXI = require('pixi.js');
var _ = require('lodash');

var scaleVal;
var scale;
var tileBase;
var tileSize;
var layers;
var frames;
var pixisprites;

function setup(stage, spritesheet) {
  scaleVal = 4;
  scale = {x: scaleVal, y: scaleVal};
  tileBase = spritesheet.meta.tile;
  tileSize = tileBase * scaleVal;
  layers = [ // 4 layers
    new PIXI.Container(), // 0: background
    new PIXI.Container(), // 1: foreground
    new PIXI.Container(), // 2: foreground (player)
    new PIXI.Container()  // 3: interface
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
    if (entity.destroyed) {
      pixisprite.parent.removeChild(pixisprite);
      return;
    }

    if (pixisprite.parent) {
      pixisprite.parent.removeChild(pixisprite);
    }

    if (!sprite.frameset) return;

    var frameset = getFrame(sprite);
    var texture = PIXI.Texture.fromFrame(frameset);
    var x = position.x;
    var y = position.y;
    var baselineY = pixisprite.texture ? y + 1 - pixisprite.texture.height / tileBase : y;
    var modifiedX = toPosition(x);
    var modifiedY = pixisprite ? toPosition(baselineY) : toPosition(y);
    var layer = getLayer(sprite.layer);
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

function getFrame(sprite) {
  var frame = sprite.frameset;
  var index = sprite.frameindex;
  if (_.isNumber(frame)) return frame;
  return frames[frame][index];
}

function getLayer(layer) {
  return layers[layer];
}

module.exports = {
  setup: setup,
  update: update
};
