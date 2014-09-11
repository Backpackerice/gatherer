Sprite = Component.create({
      constructor: function Sprite (frame, layer) {
        this.setup(frame, layer);
        return this;
      },
      register: function () {
        Component.prototype.register.apply(this, arguments);
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
      },
      update: function (prop) {
        var frame = prop.frame || undefined,
            layer = prop.layer || undefined,
            time = GameTime.realtime;
        if (!this.lastUpdate) this.lastUpdate = time;
        if (!this.frame || !this.layer) this.setup(frame, layer);
        else if (frame && time - this.lastUpdate > 400) {
          var spriteFrame = Sprite.getFrame(frame);
          if (spriteFrame !== undefined)
            this.pixi.setTexture(PIXI.TextureCache[spriteFrame]);
          this.lastUpdate = time;
        }
        _.extend(this.pixi, _.omit(prop, 'frame', 'layer'));
      }
    });

Sprite.initialize = function (stage) {
  this.map = new PIXI.DisplayObjectContainer();
  this.layers = [ // 4 layers
    new PIXI.DisplayObjectContainer(),
    new PIXI.DisplayObjectContainer(),
    new PIXI.DisplayObjectContainer(),
    new PIXI.DisplayObjectContainer()
  ];
  
  stage.addChild(this.map);
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
  this.tileSize = spriteSheet.meta.tile * this.scaleVal;
};
Sprite.getFrame = function (frame) { return _.sample(this.frames[frame]); };
