
var expect = require('chai').expect;
var Genome = require('../src/components/genome.js');
var GenomeSystem = require('../src/systems/genome.js');
var random = require('../src/base/random.js');

describe('genome component', function () {
  var genome;

  it('initializes with a set of chromosomes', function () {
    genome = new Genome({});
    expect(genome.chromosomes).to.exist;
    genome = new Genome({chromosomes: [[1, 2], [1, 3]]});
    expect(genome.chromosomes).to.deep.equal([[1, 2], [1, 3]]);
  });

  it('has a ploidy equal to the number of chromatids per chromosome', function () {
    genome = new Genome({chromosomes: [[1, 2], [1, 3]]});
    expect(genome.ploidy).to.be.equal(2);
    genome = new Genome({chromosomes: [[1, 2, 3], [1, 3, 4]]});
    expect(genome.ploidy).to.be.equal(3);
  });
});

describe('genome system', function () {
  it('can perform meiosis on a single genome', function () {
    var genome = new Genome({chromosomes: [[1, 2], [1, 3]]});
    var zygote = GenomeSystem.meiosis(genome);
    zygote.forEach(function (part, i) {
      expect(genome.chromosomes[i]).to.contain(part);
    });
  });

  it('can recombine two genomes', function () {
    var genome1 = new Genome({chromosomes: [[1, 1], [1, 1]]});
    var genome2 = new Genome({chromosomes: [[2, 2], [2, 2]]});
    var chromosomes = GenomeSystem.recombine(genome1, genome2);
    expect(chromosomes).to.deep.equal([[1, 2], [1, 2]]);
  });

  it('can construct the expression of genes', function () {
    var genome = new Genome({chromosomes: [['test.foo', ''], ['foo', 'foo.bar']]});
    var expression = GenomeSystem.express(genome);
    expect(expression).to.deep.equal({
      traits: {test: 1, foo: 2, '': 1, bar: 1},
      counts: [{test: 1, foo: 1, '': 1}, {foo: 2, bar: 1}]
    });
  });
});

describe('genome generators', function () {
  it('creates a random chromosomes generator', function () {
    random.seed(123);
    var library = {'a': 1, 'b': 2, 'c': 3};
    var level = 1;
    var ploidy = 2;
    var count = 3;
    var gen = GenomeSystem.generator(library, level, ploidy, count);

    var random1 = gen.next();
    var random2 = gen.next();
    var random3 = gen.next();
    var random4 = gen.next();
    expect(random1.value).to.deep.equal([['c','b.c.c'],['c.b.c',''],['b','c'],['b','b.c.b']]);
    expect(random2.value).to.deep.equal([['',''],['c.b.b.b','c'],['b','b'],['b','c.a.b']]);
    expect(random3.value).to.deep.equal([['b.a',''],['c.c.c.c','c.a'],['b.c.c',''],['b.b','c.a']]);
    expect(random4.done).to.equal(true);
  });

  it('creates a child chromosomes generator', function () {
    random.seed(123);
    var count = 2;
    var mother = new Genome({
      chromosomes: [['c','b.c.c'],['c.b.c',''],['b','c'],['b','b.c.b']]
    });
    var father = new Genome({
      chromosomes: [['',''],['c.b.b.b','c'],['b','b'],['b','c.a.b']]
    });

    var nursery = GenomeSystem.nursery(mother, father, count);
    var child1 = nursery.next();
    var child2 = nursery.next();
    var child3 = nursery.next();
    expect(child1.value).to.deep.equal([['b.c.c',''],['','c'],['b','b'],['b','c.a.b']]);
    expect(child2.value).to.deep.equal([['b.c.c',''],['c.b.c','c.b.b.b'],['b','b'],['b.c.b','c.a.b']]);
    expect(child3.done).to.equal(true);
  });
});
