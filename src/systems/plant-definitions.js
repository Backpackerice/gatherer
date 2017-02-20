module.exports = {
  growth: {
    cost_root: getCost('root'),
    cost_stem: getCost('stem'),
    cost_leaf: getCost('leaf'),
    cost_flower: getCost('flower'),
    cost_seed: getCost('seed'),

    appearance_stem: getAppearance('stem', 0, 3),
    appearance_leaf: getAppearance('leaf', 0, 4)
  }
};

function getCost(attr) {
  return function (base, expression) {
    var traits = expression.traits;
    var attrTrait = Math.min(traits[attr] || 0, 5);
    return base - base*(attrTrait / 10);
  };
}

function getAppearance(attr, min, max) {
  return function (base, expression) {
    var attrTrait = expression.traits[attr] || min;
    attrTrait = Math.min(attrTrait, max);
    attrTrait = Math.max(attrTrait, min);
    return attrTrait;
  };
}