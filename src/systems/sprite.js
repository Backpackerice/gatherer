
var Sprite = require('../components/sprite.js');
var Position = require('../components/position.js');
var Resources = require('../systems/resources.js');

var PIXI = require('pixi.js');
var _ = require('lodash');

var layers;
var pixis;

var COLOR_FILTER_INDEX = 0;

function setup(stage) {
  layers = [ // 4 layers
    new PIXI.Container(), // 0: background
    new PIXI.Container(), // 1: foreground
    new PIXI.Container(), // 2: foreground (player)
    new PIXI.Container()  // 3: interface
  ];

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
  var textureset = Resources.getTextureSet(sprite.frameset);
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
  var resources = Resources.get();
  var basesprite = getPixiSprite(container, 0);
  var basetexture = Resources.getTextureSet(sprite.frameset)[sprite.frameindex];
  var basescale = resources.tile * resources.scale;
  var { x, y } = getPixiPosition(container, basescale, position.x, position.y);

  basesprite.texture = basetexture;
  basesprite.filters[COLOR_FILTER_INDEX].matrix = [
    sprite.color_filter[0], 0, 0, 0, 0,
    0, sprite.color_filter[1], 0, 0, 0,
    0, 0, sprite.color_filter[2], 0, 0,
    0, 0, 0, sprite.color_filter[3], 0
  ];
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
    var subscale = resources.scale * subsprite.scale;
    if (index < numPixisubs) {
      pixisprite = getPixiSprite(container, pixispriteIndex);
    } else {
      pixisprite = makePixiSprite();
      container.addChildAt(pixisprite, pixispriteIndex);
    }
    var subposition = getPixiPosition(pixisprite, resources.scale, subsprite.x, subsprite.y);
    pixisprite.texture = Resources.getTextureSet(subsprite.frameset)[0];
    pixisprite.scale.set(subscale, subscale);
    pixisprite.position.set(subposition.x, subposition.y);
    pixisprite.rotation = subsprite.rotation;
    pixisprite.filters[COLOR_FILTER_INDEX].matrix = [
      subsprite.color_filter[0], 0, 0, 0, 0,
      0, subsprite.color_filter[1], 0, 0, 0,
      0, 0, subsprite.color_filter[2], 0, 0,
      0, 0, 0, subsprite.color_filter[3], 0
    ];
  });

  return container;
}

function getPixi(i) {
  var resources = Resources.get();
  var scale = resources.scale;
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
  var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(0));
  var colorFilter = new PIXI.filters.ColorMatrixFilter();

  var filters = [];
  filters[COLOR_FILTER_INDEX] = colorFilter;

  sprite.filters = filters;
  return sprite;
}

function getPixiSprite(container, index) {
  return container.getChildAt(index);
}

function getPixiPosition(container, tileScale, x, y) {
  var baselineY = container ? y + 1 - container.height / tileScale : y;
  var modifiedX = x * tileScale;
  var modifiedY = container ? baselineY * tileScale : y * tileScale;
  return { x: modifiedX, y: modifiedY };
}

function getLayer(layer) {
  return layers[layer];
}

module.exports = {
  setup: setup,
  update: update
};
