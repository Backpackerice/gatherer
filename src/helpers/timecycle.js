var GameTime = require('../base/time.js');

function cycle(elapsedMinutes) {
  var thisTime = GameTime.now();
  GameTime.set(thisTime.time + elapsedMinutes);
}

module.exports = {
  cycle,
  HOUR: 60,
  DAY: 60 * 24
};
