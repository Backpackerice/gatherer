var _ = require('lodash');

var Gatherer = {};
var Game = require('./base/game.js');

// Entities
var Character = require('./systems/character.js');

// Systems
var ControlSystem = require('./systems/controls.js');
var SpriteSystem = require('./systems/sprite.js');
var LightingSystem = require('./systems/lighting.js');
var TerrainSystem = require('./systems/terrain.js');
var GrowthSystem = require('./systems/growth.js');
var MovementSystem = require('./systems/movement.js');
var ActionSystem = require('./systems/action.js');
var ResourceSystem = require('./systems/resources.js');

var game;
var assets = ['assets/sprites.json', 'assets/herbs.json', 'assets/leaves.json'];
var registerComponent = function (name, component) {
  Gatherer[name] = component;
  game.registerUpdate(component.cleanup.bind(component));
};

// Development Testing
Gatherer.time = require('./helpers/timecycle.js');

Gatherer.start = function () {
  game = new Game({
    assets,
    ready: function (game, loader, rawResources) {
      var resources = ResourceSystem.setup(assets, rawResources);
      SpriteSystem.setup(game.stage, resources);
      LightingSystem.setup(game.stage);
      ControlSystem.setup(document.body);

      GrowthSystem.setup(resources);
      TerrainSystem.generate(12, 12);

      var character = new Character(0, 0);
      ControlSystem.entity(character);
    }
  });

  // updates in update loop
  game.registerUpdate(LightingSystem.update);
  game.registerUpdate(TerrainSystem.update);
  game.registerUpdate(GrowthSystem.update);
  game.registerUpdate(MovementSystem.update);
  game.registerUpdate(ActionSystem.update);

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
