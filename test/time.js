
var expect = require('chai').expect;
var GameTime = require('../src/base/time.js');

describe('gametime', function () {
  GameTime.MINUTE = 5;

  it('can be started', function () {
    expect(GameTime.now()).to.not.be.defined;
    GameTime.start();
    expect(GameTime.now()).to.be.defined;
  });

  it('can return the current gametime', function () {
    GameTime.start();
    var gametime = GameTime.now();
    expect(gametime).to.be.an.instanceof(GameTime);
  });

  it('can update the time', function (done) {
    GameTime.start();
    var gametime = GameTime.now();
    var gametime2;
    setTimeout(function () {
      GameTime.update();
      gametime2 = GameTime.now();
      expect(gametime2.time - gametime.time).to.be.closeTo(2, 1);
      done();
    }, 10);
  });

  it('can be set', function () {
    GameTime.set(10, 1000);
    var gametime = GameTime.now();
    expect(gametime.time).to.equal(10);
    expect(gametime.realtime).to.equal(1000);
  });

  it('can be paused', function (done) {
    GameTime.start();
    GameTime.pause();
    var gametime = GameTime.now();
    var gametime2;
    setTimeout(function () {
      GameTime.update();
      gametime2 = GameTime.now();
      expect(gametime2.time - gametime.time).to.equal(0);
      done();
    }, 10);
  });

  it('can be unpaused', function (done) {
    GameTime.start();
    GameTime.pause();
    GameTime.unpause();
    var gametime = GameTime.now();
    var gametime2;
    setTimeout(function () {
      GameTime.update();
      gametime2 = GameTime.now();
      expect(gametime2.time - gametime.time).to.be.closeTo(2, 1);
      done();
    }, 10);
  });
});

describe('gametime instance', function () {
  it('is created given the gametime minutes and realtime', function () {
    var realtime = Date.now();
    var gametime = new GameTime(5, realtime);
    expect(gametime.time).to.equal(5);
    expect(gametime.realtime).to.equal(realtime);
  });

  it('computes the elapsed time', function () {
    var time = 60*24*30*2*4 + 60*24*30*3 + 60*24*8 + 60*7 + 34;
    var gametime = new GameTime(time);
    expect(gametime.years).to.equal(1);
    expect(gametime.seasons).to.equal(5);
    expect(gametime.months).to.equal(11);
    expect(gametime.days).to.equal(338);
    expect(gametime.hours).to.equal(8119);
    expect(gametime.minutes).to.equal(time);
  });

  it('computes the current game date', function () {
    var time = 60*24*30*2*4 + 60*24*30*3 + 60*24*8 + 60*7 + 34;
    var gametime = new GameTime(time);
    expect(gametime.year).to.equal(1);
    expect(gametime.season).to.equal(1);
    expect(gametime.month).to.equal(3);
    expect(gametime.day).to.equal(8);
    expect(gametime.hour).to.equal(7);
    expect(gametime.minute).to.equal(34);
  });

  it('can generate a string representation', function () {
    var time = 60*24*30*2*4 + 60*24*30*3 + 60*24*8 + 60*7 + 34;
    var gametime = new GameTime(time);
    expect(gametime.toString()).to.equal('Year 1, Tuesday April 8 7:34');
  });
});

