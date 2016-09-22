var GameTime = require('../base/time.js');

function wait(elapsedMinutes) {
  var thisTime = GameTime.now();
  var waitTime = GameTime.set(thisTime.time + elapsedMinutes);
  return waitTime.toString();
}

module.exports = {
  wait,
  HOUR: 60,
  DAY: 60 * 24
};
