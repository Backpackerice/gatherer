var _ = require('lodash');
var PIXI = require('pixi.js');
var GameTime = require('./time.js');

function Game (options) {
  this.width = options.width || window.innerWidth;
  this.height = options.height || window.innerHeight;
  this.stage = options.stage || new PIXI.Container(0x231b17);
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
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

    var loader = new PIXI.loaders.Loader();
    loader.add(this.assets);
    loader.on('complete', this.onReady.bind(this));
    loader.load();

    this.renderer = new PIXI.autoDetectRenderer(
      this.width, this.height, {view: view}
    );
    return this.renderer.view;
  },

  onReady: function (loader, resources) {
    GameTime.start();
    this.ready(loader, resources);
    this.loop();
  },

  registerUpdate: function (update) {
    this.updaters.push(update);
  },

  registerRender: function (render) {
    this.renderers.push(render);
  },

  update: function (time) {
    var newGameTime = this.time = GameTime.tick(time); // Tick time first
    _.each(this.updaters, function (update) {
      update(newGameTime);
    });
  },

  render: function () {
    var time = this.time;
    this.renderer.render(this.stage);
    _.each(this.renderers, function (render) {
      render(time);
    });
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
