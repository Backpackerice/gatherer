Sprite = Component.create({
      constructor: function Sprite (options) {
        this.update(options);
        return this;
      },
      register: function () {
        this._parent_.register.apply(this, arguments);
        if (this.pixi) this.pixi.entity = this.entity;
        return this;
      },
      setup: function (frame, layer) {
        if (this.frame && this.layer) return; // already setup
        if (frame && !this.frame) {
          this.pixi = PIXI.Sprite.fromFrame(Sprite.getFrame(frame));
          this.pixi.scale = Sprite.scale;
          if (this.entity) this.pixi.entity = this.entity;
          this.frame = frame;
        }
        if (layer && !this.layer) this.layer = layer;
        if (this.frame && this.layer) {
          if (this.layer === 'map') Sprite.map.addChild(this.pixi);
          else Sprite.layers[this.layer].addChild(this.pixi);
        }
        return this;
      },
      update: function (prop) {
        if (!prop) return;
        var frame = prop.frame || undefined,
            layer = prop.layer || undefined,
            time = GameTime.realtime;
        if (!this.lastUpdate) this.lastUpdate = time;
        if (!this.frame || !this.layer) this.setup(frame, layer);
        else {
          if (frame && time - this.lastUpdate > 400) {
            var spriteFrame = Sprite.getFrame(frame);
            if (spriteFrame !== undefined)
              this.pixi.setTexture(PIXI.TextureCache[spriteFrame]);
            this.lastUpdate = time;
          }
        }
        if (prop.position)
          prop.position = this.getPosition(prop.position.x, prop.position.y, prop.position.align);
        _.extend(this.pixi, _.omit(prop, 'frame', 'layer'));
        return this;
      },
      getPosition: function (x, y, align) {
        var frame = this.pixi.texture.frame,
            scale = this.pixi.scale;
        align = align ? align instanceof Array ? align : align.split(' ') : ['baseline'];
        _.each(align, function (a) {
          if (a === 'middle') y = y - frame.height / (2 * Sprite.tile);
          if (a === 'center') x = x - frame.width / (2 * Sprite.tile);
          if (a === 'right') x = x - frame.width / Sprite.tile;
          if (a === 'baseline') y = y + 1 - frame.height / Sprite.tile;
        }.bind(this));
        return Sprite.toPosition(x, y);
      },
      remove: function () {
        if (this.layer === 'map' && Sprite.map.contains(this.pixi)) Sprite.map.removeChild(this.pixi);
        else if (Sprite.layers[this.layer].contains(this.pixi)) Sprite.layers[this.layer].removeChild(this.pixi);
        return this;
      }
    });

Sprite.initialize = function (stage) {
  this.map = new PIXI.DisplayObjectContainer(); // tile
  this.layers = [ // 4 layers
    new PIXI.DisplayObjectContainer(), // 0: effects 1
    new PIXI.DisplayObjectContainer(), // 1: foreground
    new PIXI.DisplayObjectContainer(), // 2: characters
    new PIXI.DisplayObjectContainer() // 3: effects 2
  ];
  
  stage.addChild(this.map);
  _.each(this.layers, function (layer) { stage.addChild(layer); }.bind(this));
};
Sprite.toPosition = function (x, y) { return {x: x * this.tileSize, y: y * this.tileSize}; };
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
Sprite.getFrame = function (frame) { return _.sample(this.frames[frame]); };
