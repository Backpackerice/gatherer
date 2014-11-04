Environment = Component.create({
  tile: null,
  layer: null,
  constructor: function Environment () { return this; },
  move: function (x, y, z) {
    var currTile = this.tile;
    if (x !== undefined) {
      var nextTile = Environment.getTile(x, y);
      if (!nextTile[z]) {
        if (currTile) currTile[z] = null;
        nextTile[z] = this.entity;
        this.tile = nextTile;
        this.layer = z;
      }
    } else {
      currTile[this.layer] = null;
      this.tile = null;
      this.layer = null;
    }
    this.emit('move', this.tile);
    return this;
  }
});

Environment.tiles = {};
Environment.tilesByCoord = {};
Environment.BACKGROUND = 0; Environment.FOREGROUND = 1; Environment.CHARACTER = 2;
Environment.generate = function (rows, cols) {
  for (var x = 0; x < cols; x++)
    for (var y = 0; y < rows; y++) {
      this.createTile({
        x: x, y: y,
        sourceEffects: {light: Math.random(), water: Math.random(), soil: Math.random()}
      });
    }
  return this.tiles;
};
Environment.getTile = function (xOrId, y) {
  if (y !== undefined) return this.tilesByCoord[xOrId][y];
  return this.tiles[xOrId];
};
Environment.createTile = function (options) {
  var tile = new Tile(options),
      tileEntity = Entity.create([
        tile, new Sprite({position: {x: tile.x, y: tile.y}, layer: 'map', frame: tile.frame})
      ]);

  this.tilesByCoord[tile.x] = this.tilesByCoord[tile.x] || {};
  this.tilesByCoord[tile.x][tile.y] = tile;
  this.tiles[tileEntity.id] = tile;

  // find nearby
  if (this.tilesByCoord[tile.x - 1]) {
    tile.addNearby(this.tilesByCoord[tile.x - 1][tile.y - 1]);
    tile.addNearby(this.tilesByCoord[tile.x - 1][tile.y]);
    tile.addNearby(this.tilesByCoord[tile.x - 1][tile.y + 1]);
  }

  if (this.tilesByCoord[tile.x + 1]) {
    tile.addNearby(this.tilesByCoord[tile.x + 1][tile.y - 1]);
    tile.addNearby(this.tilesByCoord[tile.x + 1][tile.y]);
    tile.addNearby(this.tilesByCoord[tile.x + 1][tile.y + 1]);
  }

  tile.addNearby(this.tilesByCoord[tile.x][tile.y - 1]);
  tile.addNearby(this.tilesByCoord[tile.x][tile.y + 1]);
};
