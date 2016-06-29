var Gatherer = {};
var Game = require('./base/game.js');

// Systems
var ControlSystem = require('./systems/controls.js');
var SpriteSystem = require('./systems/sprite.js');
var TerrainSystem = require('./systems/terrain.js');
var GrowthSystem = require('./systems/growth.js');
var MovementSystem = require('./systems/movement.js');

var game;
var registerComponent = function (name, component) {
  Gatherer[name] = component;
  game.registerUpdate(component.cleanup.bind(component));
};

Gatherer.start = function () {
  game = new Game({
    assets: ['assets/sprites.json'],
    ready: function (game, loader, resources) {
      SpriteSystem.setup(game.stage, resources['assets/sprites.json'].data);
      ControlSystem.setup(document.body);
      TerrainSystem.generate(12, 12);
    }
  });

  // updates in update loop
  game.registerUpdate(TerrainSystem.update);
  game.registerUpdate(GrowthSystem.update);
  game.registerUpdate(MovementSystem.update);

  // updates in render loop
  game.registerRender(SpriteSystem.update);

  // Other component updates.
  registerComponent('Sprite',  require('./components/sprite.js'));
  registerComponent('Terrain', require('./components/terrain.js'));
  registerComponent('Movable',  require('./components/movable.js'));
  registerComponent('Position',  require('./components/position.js'));
  registerComponent('Growth',  require('./components/growth.js'));
  registerComponent('Genome',  require('./components/genome.js'));

  var view = game.start();
  document.body.appendChild(view);
};

module.exports = Gatherer;
