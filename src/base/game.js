var _ = require('lodash'),
    PIXI = require('pixi.js'),
    GameTime = require('./time.js');

function Game (options) {
  this.width = options.width || window.innerWidth;
  this.height = options.height || window.innerHeight;
  this.stage = options.stage || new PIXI.Stage(0x231b17);
  this.assets = options.assets || [];
  this.ready = options.ready || _.noop;
  this.progress = options.progress || _.noop;

  this.updaters = [];
  this.renderers = [];
  this.time = null;
  return this;
}

Game.prototype = {
  start: function (view) {
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height, {view: view});
    this.loader = new PIXI.AssetLoader(this.assets);
    this.loader.on('onComplete', this.onLoaderComplete.bind(this));
    this.loader.on('onProgress', this.onLoaderProgress.bind(this));

    document.body.appendChild(this.renderer.view);
    this.loader.load();
  },
  onLoaderProgress: function (e) { this.progress(e.content); },
  onLoaderComplete: function () {
    GameTime.start();
    this.ready();
    this.loop();
  },

  registerUpdate: function (update) { this.updaters.push(update); },
  registerRender: function (render) { this.renderers.push(render); },

  update: function (time) {
    var newGameTime = this.time = GameTime.tick(time); // Tick time first
    _.each(this.updaters, function (update) { update(newGameTime); });
  },

  render: function () {
    var time = this.time;
    this.renderer.render(this.stage);
    _.each(this.renderers, function (render) { render(time); });
  },

  loop: function () {
    var lastTime = null,
        animate = function (time) {
          if (!lastTime) lastTime = time;
          while (lastTime <= time) {
            this.update(lastTime);
            lastTime += 10; // 10 ms update batching
          }
          this.render();
          this.frame = window.requestAnimationFrame(animate);
        }.bind(this);
    this.frame = window.requestAnimationFrame(animate);
  }
};

if (module && module.exports) module.exports = Game;
