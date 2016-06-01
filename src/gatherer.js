var Gatherer = {};
var Game = require('./base/game.js');

// Systems
var SpriteSystem = require('./systems/sprite.js');
var TerrainSystem = require('./systems/terrain.js');

// Generators
var map = require('./entities/map.js');

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
      map(12, 12);
      // TODO: better interactions setup
      // var actions = new Actions(),
      //     player = new Entity([actions, new Hunger(), new Health()]),
      //     nursery = new Entity([new Useable(), new PlantGenerator()]);

      // _.each(Environment.tiles, function (tile) {
      //   Sprite.get(tile.entity).update({ // add interactions
      //     buttonMode: true,
      //     interactive: true,
      //     click: function (sprite) {
      //       if (tile[Environment.FOREGROUND]) console.log(actions.harvest(tile));
      //       else actions.plant(nursery, tile);
      //     }
      //   });
      // });
    }
  });

  // updates in update loop
  // game.registerUpdate(Health.update.bind(Health));
  // game.registerUpdate(Hunger.update.bind(Hunger));
  // game.registerUpdate(Growth.update.bind(Growth));
  game.registerUpdate(TerrainSystem.update);

  // updates in render loop
  game.registerRender(SpriteSystem.update);

  // Other component updates.
  registerComponent('Sprite',  require('./components/sprite.js'));
  registerComponent('Terrain', require('./components/terrain.js'));
  registerComponent('Position',  require('./components/position.js'));

  var view = game.start();
  document.body.appendChild(view);
};

module.exports = Gatherer;
