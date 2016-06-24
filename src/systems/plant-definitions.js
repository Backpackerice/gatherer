module.exports = {
  growth: {
    cost_root: getCost('root'),
    cost_stem: getCost('stem'),
    cost_leaf: getCost('leaf'),
    cost_flower: getCost('flower'),
    cost_seed: getCost('seed')
  }
};

function getCost(attr) {
  return function (base, expression) {
    var traits = expression.traits;
    var attrTrait = Math.min(traits[attr] || 0, 5);
    return base - base*(attrTrait / 10);
  };
}
