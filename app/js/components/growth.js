Growth = Component.create({
      constructor: function Growth () { return this; },
      stage: -1,
      SEED: 0, SPROUT: 1, MATURE: 2, FLOWERING: 3, RIPENING: 4, RESTING: 5,
      start: function () {
        if (!this.traits) this.traits = Traits.get(this.entity);
        if (!this.env) this.env = Environment.get(this.entity);
        if (!this.sprite) this.sprite = Sprite.get(this.entity);

        this.ticks = this.cycle = this.stems = this.leaves = this.flowers = this.roots = this.seeds = 0;
        if (!this.traits.dud) this.advance();
        return this;
      },
      stop: function () {
        growth.stage = -1;
        Sprite.get(this.entity).remove();
        Environment.get(this.entity).move();
        return this;
      },
      advance: function (stage) {
        this.stage = stage ? stage : this.stage + 1;
        this.stageTick = this.ticks;
        this.updateSprite();
        return this;
      },
      updateSprite: function () {
        if (this.stage < this.SEED) return; // not started
        if (this.sprite) this.sprite.update({
          frame: 'growth-' + Math.min(this.stage, 4) + '_1',
          position: {x: this.env.tile.x, y: this.env.tile.y},
          layer: this.env.layer
        });
        return this;
      },
      tick: function (gametime) {
        if (this.stage < this.SEED) return; // not started
        if (!this.lastTick) this.lastTick = new GameTime();

        var lastTick = this.lastTick;
        if (gametime.days > lastTick.days) {
          this.doTick[this.stage].bind(this)();
          this.ticks++;
          this.lastTick = gametime;
        }
        return this;
      },

      doTick: [
        function seed () {
          var source = this.env.tile.effects.source;
          if (this.roots > 0 || source.soil + source.water > 0.6)
            this.roots += this.traits.root.output * (source.water + source.soil);
          if (this.roots > 4) this.advance();
          return this;
        },

        function sprout () {
          var source = this.env.tile.effects.source;
          this.roots += this.traits.root.output * (source.water + 0.5 * source.soil);
          this.stems += this.traits.stem.output * (source.water + source.soil);
          this.leaves += 0.5 * this.traits.leaf.output * (source.water + 2 * source.light);
          if (this.leaves > 5) this.advance();
          return this;
        },

        function mature () {
          var source = this.env.tile.effects.source;
          this.roots += 0.5 * this.traits.root.output * (source.water + 0.5 * source.soil);
          this.stems += 0.5 * this.traits.stem.output * (source.water + source.soil);
          this.leaves += 0.5 * this.traits.leaf.output * (source.water + 2 * source.light);
          if (this.leaves + this.roots + this.stems > 20 && this.ticks > 20) this.advance();
          return this;
        },

        function flowering () {
          var source = this.env.tile.effects.source;
          this.flowers += 0.5 * this.traits.flower.output * (source.light + source.water + source.soil);
          if (this.flowers > (3 + 1.5 * this.traits.flower.blooming) && this.ticks - this.stageTick > 5) this.advance();
          return this;
        },

        function ripening () {
          this.flowers = this.flowers - 1;
          this.seeds += this.traits.seed.output;
          if (Math.floor(this.flowers) <= 0) this.advance();
          return this;
        },

        function resting () {
          var next = false,
              replenish = Math.random() > 0.66;

          if (replenish && (this.cycle < this.traits.replenishing + this.traits.life || this.traits.life > 1)) {
            if (this.traits.replenishing) next = this.MATURE;
            if (this.traits.seasonal && !isNaN((this.ticks - this.stageTick) % 24)) next = this.MATURE;
          }
          if (next) {
            this.cycle++;
            this.advance(next);
          }
          return this;
        }
      ]
    });

Growth.tick = function () {
  var time = new GameTime();
  this.each(function (growth) {
    growth.tick(time);
    growth.updateSprite();
  });
};

Game.registerTick(Growth);
