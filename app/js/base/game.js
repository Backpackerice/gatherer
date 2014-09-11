function  Game (options) {
            _.extend(this, this.defaults, options);
            return this;
          }

          Game.prototype.defaults = {
            width: window.innerWidth, height: window.innerHeight
          };
          Game.prototype.start = function () {
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

            this.stage = new PIXI.Stage(0x231b17);
            this.renderer = new PIXI.autoDetectRenderer(this.width, this.height);
            this.loader = new PIXI.AssetLoader(['/data/sprites.json']);
            this.loader.on('onComplete', this.onLoad.bind(this));
            this.loader.on('onProgress', this.onLoading.bind(this));

            Sprite.initialize(this.stage);

            document.body.appendChild(this.renderer.view);
            this.loader.load();
          };
          Game.prototype.onLoading = function (e) {
            var loader = e.loader;
            if (e.loader.json && e.loader.json.frames) Sprite.load(e.loader.json);
          };
          Game.prototype.onLoad = function () {
            GameTime.start();
            Environment.generate(5, 6);
            var Nursery = new PlantGenerator(),
                plantLayer = 1;

            _.each(Environment.tiles, function (tile) {
              Sprite.get(tile.id).update({ // add interactions
                buttonMode: true,
                interactive: true,
                click: function (sprite) {
                  var plant = Nursery.get(1);
                  if (Environment.get(plant.id).move(tile.x, tile.y, plantLayer))
                    Growth.get(plant.id).start();
                }
              });
            });
            
            this.tick();
          };
          Game.prototype.tick = function () {
            var start = null,
                animate = function (time) {
                  GameTime.tick(time);
                  this.renderer.render(this.stage);
                  this.frame = window.requestAnimationFrame(animate);
                }.bind(this);
            this.frame = window.requestAnimationFrame(animate);
          };
