
var expect = require('chai').expect;
var Genome = require('../src/components/genome.js');
var TraitSystem = require('../src/systems/trait.js');

describe('trait system', function () {
  it('can construct the expression of genes', function () {
    var genome = new Genome({chromosomes: [['test.foo', ''], ['foo', 'foo.bar']]});
    var expression = TraitSystem.express(genome);
    expect(expression).to.deep.equal({
      traits: {test: 1, foo: 2, '': 1, bar: 1},
      counts: [{test: 1, foo: 1, '': 1}, {foo: 2, bar: 1}]
    });
  });
});
