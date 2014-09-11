Environment = Component.create({
      constructor: function Environment () { return this; },
      tile: null,
      move: function (x, y, z) {
        var currTile = this.tile;
        if (x !== undefined) {
          var nextTile = Environment.getTile(x, y);
          if (!nextTile[z]) {
            if (currTile) currTile[z] = null;
            nextTile[z] = this.entity;
            this.tile = nextTile;
          }
        } else {
          currTile[z] = null;
          this.tile = null;
        }
        return this.tile;
      }
    });

Environment.tiles = {};
Environment.tilesByCoord = {};
Environment.generate = function (rows, cols) {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      this.createTile({x: x, y: y}, {
        light: Math.random(),
        water: Math.random(),
        soil: Math.random(),
      });
    }
  }
  return this.tiles;
};
Environment.toPosition = function (x, y) { return {x: x * Sprite.tileSize, y: y * Sprite.tileSize}; };
Environment.getTile = function (xOrId, y) {
  if (y !== undefined) return this.tilesByCoord[xOrId][y];
  return this.tiles[xOrId];
};
Environment.createTile = function (coord, effects) {
  var tile = new Tile(coord, effects),
      sprite = new Sprite(tile.frame, 'map').register(tile);
  sprite.update({position: this.toPosition(tile.x, tile.y)});
  this.tilesByCoord[coord.x] = this.tilesByCoord[coord.x] || {};
  this.tilesByCoord[coord.x][coord.y] = tile;
  this.tiles[tile.id] = tile;
};

function Tile (options, sourceEffects) {
  this.id = _.uniqueId('tile');
  this.effects = {};
  this.nearby = [];
  this.addEffects(sourceEffects);
  _.extend(this, options);

  this.frame = 'tile-' + _.chain(sourceEffects).pairs()
      .max(function (pair) { return pair[1]; }).first().value();
  return this;
}

Tile.prototype = {
  addEffects: function (effects, entity) {
    var source = entity === undefined ? 'source' : entity;
    if (!this.effects[source]) this.effects[source] = {};
    _.extend(this.effects[source], effects);
  },

  getEntities: function () {
    return _.chain(this).clone().omit('nearby', 'effects', 'coordinates').toArray().value();
  }
};
