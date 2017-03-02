module.exports = {
  growth: {
    cost_root: getCost('root'),
    cost_stem: getCost('stem'),
    cost_leaf: getCost('leaf'),
    cost_flower: getCost('flower'),
    cost_seed: getCost('seed'),

    appearance_stem: getAppearance('stem', 0, 3),
    appearance_leaf: getAppearance('leaf', 0, 4),

    color_stem: getColor('stem')
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

function getColor(attr) {
  return function (base, expression) {
    var UPPER_BOUND = 3;
    var baseColors = [1, 1, 1];
    var colors = [0, 0, 0];

    var computeColor = (baseColor, color, maxColor) => {
      var value = Math.min(color, UPPER_BOUND);
      return (baseColor * UPPER_BOUND - maxColor + value) / UPPER_BOUND;
    };

    if (expression.counts) {
      expression.counts.forEach((countObj) => {
        var red = 0;
        var yellow = 0;
        var blue = 0;
        if (attr in countObj) {
          red = countObj.red || 0;
          yellow = countObj.yellow || 0;
          blue = countObj.blue || 0;
        }
        colors[0] += yellow / 2 + red;
        colors[1] += yellow / 2 + blue / 2;
        colors[2] += blue;
      });
    }

    var maxColor = Math.max.apply(null, colors);

    return [
      computeColor(baseColors[0], colors[0], maxColor),
      computeColor(baseColors[1], colors[1], maxColor),
      computeColor(baseColors[2], colors[2], maxColor),
      1
    ];
  };
}