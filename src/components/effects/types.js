module.exports = {
  edible: function (level) {
    return function (entity) {
      if (level) entity.emit('hunger:consume', level);
    };
  },
  poison: function (level) {
    return function (entity) {
      if (level) entity.emit('effect:poison', level);
    };
  }
};
