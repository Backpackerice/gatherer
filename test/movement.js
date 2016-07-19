
var expect = require('chai').expect;
var MovementSystem = require('../src/systems/movement.js');
var Movable = require('../src/components/movable.js');
var Position = require('../src/components/position.js');
var GameTime = require('../src/base/time.js');
var Entity = require('../src/base/entity.js');

describe('movement system', function () {
  var time = 1000;
  GameTime.start(0, time);

  it('updates the position of movable entities', function () {
    var entity = new Entity();
    var position = entity.set(Position, {x: 5, y: 5});
    entity.set(Movable, {speed: 1, to_position: [4, 4]});

    MovementSystem.update(GameTime.now());
    tick();
    MovementSystem.update(GameTime.now());

    expect(position.x).to.equal(4);
    expect(position.y).to.equal(4);
  });

  function tick() {
    time += 1000;
    GameTime.update(time);
  }
});
