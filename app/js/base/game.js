function  Game (options) {
            _.extend(this, this.defaults, options);
            return this;
          }

Game.ticks = {};
Game.registerTick = function (tickable) {
  var key = tickable.id || tickable.name;
  this.ticks[key] = tickable.tick.bind(tickable);
};

Game.prototype = {
  defaults: { width: window.innerWidth, height: window.innerHeight },
  start: function () {
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

    this.stage = new PIXI.Stage(0x231b17);
    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height);
    this.loader = new PIXI.AssetLoader(['data/sprites.json']);
    this.loader.on('onComplete', this.onLoad.bind(this));
    this.loader.on('onProgress', this.onLoading.bind(this));

    Sprite.initialize(this.stage);

    document.body.appendChild(this.renderer.view);
    this.loader.load();
  },
  onLoading: function (e) {
    var loader = e.loader;
    if (e.loader.json && e.loader.json.frames) Sprite.load(e.loader.json);
  },
  onLoad: function () {
    GameTime.start();
    Environment.generate(12, 12);
    var actions = new Actions(),
        player = Entity.create([actions, new Hunger(), new Health()]),
        nursery = Entity.create([new Useable(), new PlantGenerator()]);

    _.each(Environment.tiles, function (tile) {
      Sprite.get(tile.entity).update({ // add interactions
        buttonMode: true,
        interactive: true,
        click: function (sprite) {
          if (tile[Environment.FOREGROUND]) console.log(actions.harvest(tile));
          else actions.plant(nursery, tile);
        }
      });
    });
    
    this.tick();
  },
  tick: function () {
    var start = null,
        animate = function (time) {
          GameTime.tick(time); // Always first, no need to register GameTime
          _.each(Game.ticks, function (tick) { tick(time); });

          this.renderer.render(this.stage);
          this.frame = window.requestAnimationFrame(animate);
        }.bind(this);
    this.frame = window.requestAnimationFrame(animate);
  }
};
