
var expect = require('chai').expect;
var Genome = require('../src/components/genome.js');
var GenomeSystem = require('../src/systems/genome.js');

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
});

describe('plant generator', function () {
  
});