var PIXI = require('../vendor/extensions/pixi.js'),
    _ = require('../vendor/lodash.js'),
    Component = require('../base/component.js');

var Sprite = module.exports = new Component({
      constructor: function Sprite (frameSet, layer, x, y) {
        this.frameSetId = frameSet || 0;
        this.layerId = layer || 1;

        this.frameSet = null;
        this.layer = null;

        this.x = x || 0;
        this.y = y || 0;

        this.modifiedX = 0;
        this.modifiedY = 0;

        this.pixi = new PIXI.Sprite(Sprite.getTexture(0)); // need to initialize with a texture
        this.pixi.scale.set(Sprite.scaleVal, Sprite.scaleVal);

        this.setFrameSet(this.frameSetId);
        this.setLayer(this.layerId);
        this.setXY(this.x, this.y);
        return this;
      },

      destroy: function () {
        this._parent_.destroy.apply(this, arguments);
        this.pixi.parent.removeChild(this.pixi);
        return this;
      },

      setFrameSet: function (key) {
        this.frameSetId = key;
        this.frameSet = Sprite.getFrame(key); // getFrameSet
        var texture = Sprite.getTexture(this.frameSet); //this.frameSet[0]
        this.pixi.setTexture(texture);
        this.setXY(this.x, this.y); // update position in case of height change
        return this;
      },

      setLayer: function (layer) {
        this.layerId = layer;
        this.layer = Sprite.getLayer(layer);
        if (this.pixi.parent) this.pixi.parent.removeChild(this.pixi);
        this.layer.addChild(this.pixi);
        return this;
      },

      setXY: function (x, y) {
        this.x = x;
        this.y = y;

        var baselineY = this.pixi.frame ? y + 1 - this.pixi.frame.height / Sprite.tile : y;

        this.modifiedX = Sprite.toPosition(x);
        this.modifiedY = this.pixi ? Sprite.toPosition(baselineY) : Sprite.toPosition(y);
        this.pixi.position.set(this.modifiedX, this.modifiedY);
        return this;
      },

      update: function (time) {
        return;
      }
    });

Sprite.initialize = function (stage) {
  this.layers = [ // 4 layers
    new PIXI.DisplayObjectContainer(), // 0: terrain
    new PIXI.DisplayObjectContainer(), // 1: behind player
    new PIXI.DisplayObjectContainer(), // 2: at player
    new PIXI.DisplayObjectContainer() // 3: in front of player
  ];
  _.each(this.layers, function (layer) { stage.addChild(layer); }.bind(this));
};
Sprite.load = function (spriteSheet) {
  var frames = spriteSheet.frames;
  this.scaleVal = 4;
  this.frames = _.chain(frames).map(function (frame, i) {
        frame.index = i;
        return frame;
      }).groupBy('name')
      .mapValues(function (set) { return _.pluck(set, 'index'); }).value();
  this.scale = {x: this.scaleVal, y: this.scaleVal};
  this.tile = spriteSheet.meta.tile;
  this.tileSize = spriteSheet.meta.tile * this.scaleVal;
};
Sprite.update = function (time) {
  var sprites = this.get();
  for (var i = 0; i < sprites.length; i++) { sprites[i].update(time); }
};

Sprite.toPosition = function (x) { return x * this.tileSize; };
Sprite.getFrame = function (frame) {
  if (_.isNumber(frame)) return frame;
  return _.sample(this.frames[frame]);
};
Sprite.getTexture = function (frame) { return PIXI.Texture.fromFrame(frame); };
Sprite.getLayer = function (layer) { return this.layers[layer]; };
