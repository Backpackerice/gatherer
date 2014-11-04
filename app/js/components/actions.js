Actions = Component.create({
  constructor: function Actions () { return this; },

  consume: function () {
    return Useable.get(e).use(function (e) {
      var consummable = Consummable.get(e);
      if (consummable) consummable.consume(this.entity);
      if (Useable.get(e).count > 1) return e;
    }.bind(this));
  },

  plant: function (e, tile) {
    return Useable.get(e).use(function (e) {
      var plantGen = PlantGenerator.get(e);
      if (plantGen) {
        var genome = new Genome({chromosomes: plantGen.get()}),
            plant = Entity.create([
              new Environment(), new Sprite(),
              genome, new Traits({traits: genome.express()}), new Growth()
            ]);
        if (Environment.get(plant).move(tile.x, tile.y, Environment.FOREGROUND))
          Growth.get(plant).start();
      }
      if (Useable.get(e).count > 1) return e;
    }.bind(this));
  },

  harvest: function (tile) {
    var leaves, roots, stems, seeds, flowers,
        e = tile[Environment.FOREGROUND],
        growth = Growth.get(e);
    if (growth) {
      var parents = [e];
      _.each(tile.nearby, function (nearbyTileId) {
        var tile = Environment.getTile(nearbyTileId),
            e = tile[Environment.FOREGROUND],
            growth = Growth.get(e);
        if (growth && growth.stage > growth.FLOWERING) parents.push(e);
      });
      // generate entities
      leaves = Entity.create([new Useable({count: Math.floor(growth.leaves / 2)})]);
      roots = Entity.create([new Useable({count: Math.floor(growth.roots / 2)})]);
      stems = Entity.create([new Useable({count: Math.floor(growth.stems / 2)})]);
      flowers = Entity.create([new Useable({count: Math.floor(growth.flowers)})]);
      seeds = Entity.create([
        new Useable({count: Math.floor(growth.seeds/2)}),
        new PlantGenerator({parents: parents})
      ]);

      // remove plant
      growth.stop();
    }
    return [leaves, roots, stems, seeds, flowers];
  }
});
