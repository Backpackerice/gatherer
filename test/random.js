
var expect = require('chai').expect;
var random = require('../src/base/random.js');

describe('random number generator', function () {
  it('can be seeded', function () {
    random.seed(1);
    expect(random.random()).to.equal(0.4170219984371215);
  });

  it('can generate a random integer', function () {
    random.seed(1);
    expect(random.int(1, 5)).to.equal(2);
  });
});