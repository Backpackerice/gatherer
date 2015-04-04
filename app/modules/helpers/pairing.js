// from http://sachiniscool.blogspot.com/2011/06/cantor-pairing-function-and-reversal.html
var pairing = module.exports = function (x, y) { return ((x + y) * (x + y + 1)) / 2 + y; };
