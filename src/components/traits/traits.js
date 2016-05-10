var _ = require('lodash'),
    Component = require('../../base/component.js');

var Traits = module.exports = new Component({
  constructor: function Traits (options) {
    if (options.genes) this.parse(options.genes);
    return this;
  },

  parse: function (genes) {
    this.setTraits(genes);
    this.setType(genes);
  },

  setTraits: function (genes) {
    _.each(Traits.definitions, setTrait, this);

    function setTrait (def, key) {
      var names = key.split(' '),
          name = names[0];
      if (names.length > 1) {
        if (!this[name]) this[name] = {};
        setTrait.call(this[name], def, names[1]);
      } else this[name] = def(genes);
    };
  },

  setType: function (genes) {
    _.every(Traits.types, function (type) {
      var isType = type.check(this);
      if (isType) {
        this.type = type.name;
        type.bonus(this, genes);
      }
      return !isType;
    }, this);
  }
});

Traits.types = require('./types.js');
Traits.definitions = require('./definitions.js');
