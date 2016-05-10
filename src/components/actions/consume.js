var Consummable = require('../consummable/consummable.js');

var consume = module.exports = function (e, self) {
  var consummable = Consummable.get(e);
  if (consummable) {
    consummable.consume(self);
    return e;
  }
  return false;
};
