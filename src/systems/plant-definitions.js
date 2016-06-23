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
  return function (cost, expression) {
    var traits = Math.max(expression.traits, 5);
    var attrTrait = traits[attr] || 0;
    return cost - cost*(attrTrait / 10);
  };
}
