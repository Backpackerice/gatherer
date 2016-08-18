
var expect = require('chai').expect;
var Component = require('../src/base/component.js');

describe('component factory', function () {

  afterEach(function () {
    Component.clear();
  });

  it('creates a component class given a name and defaults', function () {
    var ComponentClass = new Component('test', {hello: 'world'});
    var instance = new ComponentClass();
    expect(instance.hello).to.equal('world');
  });

  it('adds component classes to its map', function () {
    var map = Component.map;
    var ComponentClass = new Component('test', {hello: 'world'});
    expect(map.has('test')).to.equal(true);
    expect(map.get('test')).to.equal(ComponentClass);
  });

  it('can destroy a created component, removing it from the map', function () {
    var map = Component.map;
    new Component('test', {hello: 'world'});
    Component.destroy('test');
    expect(map.has('test')).to.equal(false);
  });

  it('can clear all components from the map', function () {
    var map = Component.map;
    new Component('test', {hello: 'world'});
    new Component('test2', {hello: 'world'});
    Component.clear();
    expect(map.has('test')).to.equal(false);
    expect(map.has('test2')).to.equal(false);
  });
});
