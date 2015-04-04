Gatherer = {}; // globally accessible
(function () {

  var _ = require('./modules/vendor/lodash.js');
  
  // require base
  var Game = require('./modules/base/game.js'),
      Entity = require('./modules/base/entity.js'),
      Component = require('./modules/base/component.js');

  // Expose all components
  // var Consummable     = this.Consummable    = require('./modules/consummable/consummable.js');
  // var Effects         = this.Effects        = require('./modules/effects/effects.js');
  var Terrain         = this.Terrain        = require('./modules/terrain/terrain.js');
  // var Genome          = this.Genome         = require('./modules/genome/genome.js');
  // var Growth          = this.Growth         = require('./modules/components/growth.js');
  // var Health          = this.Health         = require('./modules/components/health.js');
  // var Hunger          = this.Hunger         = require('./modules/components/hunger.js');
  // var Inventory       = this.Inventory      = require('./modules/components/inventory.js');
  // var PlantGenerator  = this.PlantGenerator = require('./modules/components/plantgen.js');
  var Sprite          = this.Sprite         = require('./modules/sprite/sprite.js');
  // var Traits          = this.Traits         = require('./modules/traits/traits.js');
  // var Useable         = this.Useable        = require('./modules/components/useable.js');

  // setup game
  var options =  {
    assets: ['/data/sprites.json'],
    ready: function () {
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
    },
    progress: function (content) {
      var loader = content.loader;
      if (loader.json && loader.json.frames) Sprite.load(loader.json);
    }
  };

  var initialize = function () {
    var game = new Game(options);
    
    Sprite.initialize(game.stage);

    // updates in update loop
    // game.registerUpdate(Health.update.bind(Health));
    // game.registerUpdate(Hunger.update.bind(Hunger));
    // game.registerUpdate(Growth.update.bind(Growth));
    // game.registerUpdate(Effects.update.bind(Effects));

    //updates in render loop
    game.registerRender(Sprite.update.bind(Sprite));

    game.start();
  };

  window.onload = initialize;
}).call(Gatherer);
