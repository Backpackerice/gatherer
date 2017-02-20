var _ = require('lodash');

var resources;

function get() {
  return resources;
}

function setup(assets, raw) {
  function parseFrames(_frames) {
    return _.chain(_frames).map(function (frame, i) {
        frame.index = i;
        return frame;
      }).groupBy('name').value();
  }

  function parseTextures(_frames, _textures) {
    return _.chain(parseFrames(_frames))
      .mapValues(function (set) {
        return _.map(set, function (frame) {
          return _textures[frame.index];
        });
      }).value();
  }

  var assetResources = assets.map(asset => raw[asset]);
  var tile = assetResources[0].data.meta.tile;
  var _frames = _.chain(assetResources)
    .map(r => r.data.frames)
    .flatten().value();
  var _textures = _.chain(assetResources)
    .map(r => _.map(r.textures))
    .flatten().value();

  var textures = parseTextures(_frames, _textures);
  var frames = parseFrames(_frames);

  resources = {
    scale: 4,
    tile,
    textures,
    frames,
    raw
  };
  return get();
}

module.exports = {
  get,
  setup
};
