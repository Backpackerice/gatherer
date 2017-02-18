
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var PIXI = require('pixi.js');
var _ = require('lodash');

var scaleVal;
var scale;
var tileBase;
var tileSize;
var layers;
var textures;
var pixisprites;

function setup(stage, tile, _frames, _textures) {
  scaleVal = 4;
  scale = {x: scaleVal, y: scaleVal};
  tileBase = tile;
  tileSize = tileBase * scaleVal;
  layers = [ // 4 layers
    new PIXI.Container(), // 0: background
    new PIXI.Container(), // 1: foreground
    new PIXI.Container(), // 2: foreground (player)
    new PIXI.Container()  // 3: interface
  ];

  textures = parseTextures(_frames, _textures);
  pixisprites = [];
  _.each(layers, function (layer) { stage.addChild(layer); });
}

function update(time) {
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

    updateSprite(sprite, time);
    updatePixiSprite(pixisprite, sprite, position);

    var layer = getLayer(sprite.layer);
    layer.addChild(pixisprite);
  });
}

function updateSprite(sprite, time) {
  var spf = 1000 / sprite.fps;
  var textureset = getTextureSet(sprite.frameset);
  var increment = sprite.fps && (time - sprite.last_tick >= spf);
  var frameindex = Math.min(sprite.frameindex, textureset.length - 1);
  var nextFrame;

  if (increment) {
    frameindex++;
    nextFrame = textureset[frameindex];
    if (!nextFrame) frameindex = 0;
    sprite.last_tick = time;
  }

  sprite.frameindex = frameindex;
  return sprite;
}

function updatePixiSprite(pixisprite, sprite, position) {
  var basesprite = getPixiBaseSprite(pixisprite);
  var texture = getTextureSet(sprite.frameset)[sprite.frameindex];
  var { x, y } = getPixiPosition(pixisprite, position.x, position.y);
  basesprite.texture = texture;
  pixisprite.x = x;
  pixisprite.y = y;

  return pixisprite;
}

function getTextureSet(frameset) {
  return textures[frameset];
}

function parseTextures(_frames, _textures) {
  return _.chain(_frames).map(function (frame, i) {
    frame.index = i;
    return frame;
  }).groupBy('name')
  .mapValues(function (set) {
    return _.map(set, function (frame) {
      return _textures[frame.index];
    });
  }).value();
}

function getPixi(i) {
  if (!pixisprites[i]) {
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(0));
    sprite.scale = scale;
    pixisprites[i] = new PIXI.Container();
    pixisprites[i].addChildAt(sprite, 0);
  }
  return pixisprites[i];
}

function getPixiBaseSprite(pixisprite) {
  return pixisprite.getChildAt(0);
}

function getPixiPosition(pixisprite, x, y) {
  var tileScale = tileBase * scaleVal;
  var baselineY = pixisprite ? y + 1 - pixisprite.height / tileScale : y;
  var modifiedX = toPosition(x);
  var modifiedY = pixisprite ? toPosition(baselineY) : toPosition(y);
  return { x: modifiedX, y: modifiedY };
}

function toPosition(x) {
  return x * tileSize;
}

function getLayer(layer) {
  return layers[layer];
}

module.exports = {
  setup: setup,
  update: update
};
