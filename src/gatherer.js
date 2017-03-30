var Gatherer = {};
Gatherer.Systems = {};
Gatherer.Components = {};

var Game = require('./base/game.js');

// Entities
var Character = require('./systems/character.js');

// Systems
var ControlSystem   = registerSystem('controls', require('./systems/controls.js'));
var SpriteSystem    = registerSystem('sprite', require('./systems/sprite.js'));
var LightingSystem  = registerSystem('lighting', require('./systems/lighting.js'));
var TerrainSystem   = registerSystem('terrain', require('./systems/terrain.js'));
var EnvironmentSystem = registerSystem('environment', require('./systems/environment.js'));
var GrowthSystem    = registerSystem('growth', require('./systems/growth.js'));
var MovementSystem  = registerSystem('movement', require('./systems/movement.js'));
var ActionSystem    = registerSystem('action', require('./systems/action.js'));
var ResourceSystem  = registerSystem('resource', require('./systems/resources.js'));

var game;
var assets = ['assets/sprites.json', 'assets/herbs.json', 'assets/leaves.json'];

// Development Testing
Gatherer.time = require('./helpers/timecycle.js');

Gatherer.start = function () {
  game = new Game({
    assets,
    ready: function (game, loader, rawResources) {
      ResourceSystem.setup(assets, rawResources);
      SpriteSystem.setup(game.stage);
      LightingSystem.setup(game.stage);
      ControlSystem.setup(document.body);
      TerrainSystem.generate(8, 8);

      var character = new Character(0, 0);
      ControlSystem.entity(character);
    }
  });

  // updates in update loop
  game.registerUpdate(LightingSystem.update);
  game.registerUpdate(TerrainSystem.update);
  game.registerUpdate(EnvironmentSystem.update);
  game.registerUpdate(GrowthSystem.update);
  game.registerUpdate(MovementSystem.update);
  game.registerUpdate(ActionSystem.update);

  // updates in render loop
  game.registerRender(SpriteSystem.update);

  // Other component updates.
  registerComponent('Sprite',   require('./components/sprite.js'));
  registerComponent('Terrain',  require('./components/terrain.js'));
  registerComponent('Arable',   require('./components/arable.js'));
  registerComponent('Spring',   require('./components/spring.js'));
  registerComponent('Movable',  require('./components/movable.js'));
  registerComponent('Position', require('./components/position.js'));
  registerComponent('Growth',   require('./components/growth.js'));
  registerComponent('Genome',   require('./components/genome.js'));

  var view = game.start();
  document.body.appendChild(view);
};

function registerComponent(name, component) {
  Gatherer.Components[name] = component;
  game.registerUpdate(component.cleanup.bind(component));
  return component;
}

function registerSystem(name, system) {
  Gatherer.Systems[name] = system;
  return system;
}

module.exports = Gatherer;
