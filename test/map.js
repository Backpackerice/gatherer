
var expect = require('chai').expect;
var mapSystem = require('../src/systems/map');

describe('map system', function () {
  describe('generateBlockMap', function () {
    it('generates a map with rivers', function () {
      var blockInfo = new mapSystem.BlockInfo(16, 16);
      blockInfo.addRiver([0, 4], [2, 1], [0.8, 1]);

      var map = mapSystem.generateBlock(blockInfo);
      expect(mapSystem.printMap(map, blockInfo)).to.equal(
        '                \n' +
        '                \n' +
        '                \n' +
        '                \n' +
        'r               \n' +
        ' rr             \n' +
        '   rr           \n' +
        '     r          \n' +
        '      rr        \n' +
        '        rr      \n' +
        '          rr    \n' +
        '           rr   \n' +
        '             r  \n' +
        '              rr\n' +
        '                '
      );
    });
  });
});
