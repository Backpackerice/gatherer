
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var PIXI = require('pixi.js');
var _ = require('lodash');

var scale;
var tileBase;
var tileSize;
var layers;
var textures;
var pixis;

function setup(stage, tile, _frames, _textures) {
  scale = 4;
  tileBase = tile;
  tileSize = tileBase * scale;
  layers = [ // 4 layers
    new PIXI.Container(), // 0: background
    new PIXI.Container(), // 1: foreground
    new PIXI.Container(), // 2: foreground (player)
    new PIXI.Container()  // 3: interface
  ];

  textures = parseTextures(_frames, _textures);
  pixis = [];
  _.each(layers, function (layer) { stage.addChild(layer); });
}

function update(time) {
  Sprite.each(function (sprite, i) {
    var entity = sprite.entity;
    var position = Position.get(entity.id);

    // TODO: deal with subsprites
    var container = getPixi(i);
    if (entity.destroyed) {
      container.parent.removeChild(container);
      return;
    }

    if (container.parent) {
      container.parent.removeChild(container);
    }

    if (!sprite.frameset) return;

    updateSprite(sprite, time);
    updatePixiContainer(container, sprite, position);

    var layer = getLayer(sprite.layer);
    layer.addChild(container);
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

function updatePixiContainer(container, sprite, position) {
  var basesprite = getPixiSprite(container, 0);
  var basetexture = getTextureSet(sprite.frameset)[sprite.frameindex];
  var { x, y } = getPixiPosition(container, position.x, position.y);

  basesprite.texture = basetexture;
  container.x = x;
  container.y = y;

  var numPixisubs = container.children.length - 1; // offset the base sprite
  var numSubs = sprite.subsprites.length;
  var numRemove = numPixisubs - numSubs;

  if (numRemove > 0) {
    container.removeChildren(container.children.length - numRemove);
  }

  sprite.subsprites.forEach(function (subsprite, index) {
    var pixisprite;
    var pixispriteIndex = index + 1; // offset the base sprite
    var subscale = subsprite.scale * scale;
    if (index < numPixisubs) {
      pixisprite = getPixiSprite(container, pixispriteIndex);
    } else {
      pixisprite = makePixiSprite();
      container.addChildAt(pixisprite, pixispriteIndex);
    }
    pixisprite.texture = getTextureSet(subsprite.frameset)[0];
    pixisprite.scale.set(subscale, subscale);
    pixisprite.position.set(subsprite.x, subsprite.y);
  });

  return container;
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
  if (!pixis[i]) {
    var pixisprite = makePixiSprite();
    var container = new PIXI.Container();
    pixisprite.scale.set(scale, scale);
    container.addChildAt(pixisprite, 0);
    pixis[i] = container;
  }
  return pixis[i];
}

function makePixiSprite() {
  return new PIXI.Sprite(PIXI.Texture.fromFrame(0));
}

function getPixiSprite(container, index) {
  return container.getChildAt(index);
}

function getPixiPosition(container, x, y) {
  var tileScale = tileBase * scale;
  var baselineY = container ? y + 1 - container.height / tileScale : y;
  var modifiedX = toPosition(x);
  var modifiedY = container ? toPosition(baselineY) : toPosition(y);
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
