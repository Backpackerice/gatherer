// from http://sachiniscool.blogspot.com/2011/06/cantor-pairing-function-and-reversal.html
var pairingInv = module.exports = function (z) {
  var t = Math.floor((-1 + Math.sqrt(1 + 8 * z))/2);
  var x = t * (t + 3) / 2 - z;
  var y = z - t * (t + 1) / 2;
  return [x, y];
};
