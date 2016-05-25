var Gatherer = {}; // globally accessible
(function () {
  // require base
  var Game = require('./base/game.js');
  // var Entity = require('./modules/base/entity.js');
  // var Component = require('./modules/base/component.js');

  // Expose all components
  // var Consummable     = this.Consummable    = require('./modules/consummable/consummable.js');
  // var Effects         = this.Effects        = require('./modules/effects/effects.js');
  var Terrain         = this.Terrain        = require('./components/terrain/terrain.js');
  // var Genome          = this.Genome         = require('./modules/genome/genome.js');
  // var Growth          = this.Growth         = require('./modules/components/growth.js');
  // var Health          = this.Health         = require('./modules/components/health.js');
  // var Hunger          = this.Hunger         = require('./modules/components/hunger.js');
  // var Inventory       = this.Inventory      = require('./modules/components/inventory.js');
  // var PlantGenerator  = this.PlantGenerator = require('./modules/components/plantgen.js');
  this.Sprite = require('./components/sprite.js');
  // var Traits          = this.Traits         = require('./modules/traits/traits.js');
  // var Useable         = this.Useable        = require('./modules/components/useable.js');
  var SpriteSystem = require('./systems/sprite.js');

  // setup game
  var options =  {
    assets: ['assets/sprites.json'],
    ready: function (game, loader, resources) {
      SpriteSystem.setup(game.stage, resources['assets/sprites.json'].data);
      Terrain.generate(12, 12);
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
  };

  var initialize = function () {
    var game = new Game(options);

    // updates in update loop
    // game.registerUpdate(Health.update.bind(Health));
    // game.registerUpdate(Hunger.update.bind(Hunger));
    // game.registerUpdate(Growth.update.bind(Growth));
    // game.registerUpdate(Effects.update.bind(Effects));

    // updates in render loop
    game.registerRender(SpriteSystem.update);

    var view = game.start();
    document.body.appendChild(view);
  };

  window.onload = initialize;
}).call(Gatherer);

module.exports = Gatherer;
