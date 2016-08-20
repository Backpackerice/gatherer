
var expect = require('chai').expect;
var Entity = require('../src/base/entity.js');
var Component = require('../src/base/component.js');

describe('entity', function () {
  var ComponentClass;

  before(function () {
    ComponentClass = new Component('test', {
      hello: 'world'
    });
  });

  after(function () {
    Component.clear();
  });

  it('generates an id', function () {
    var entity = new Entity();
    expect(entity.id).to.be.defined;
  });

  it('sets components onto itself', function () {
    var entity = new Entity();
    var component = entity.set(ComponentClass, {hello: 'hi'});
    expect(component.hello).to.equal('hi');
    expect(component.entity).to.equal(entity);
  });

  it('gets components', function () {
    var entity = new Entity();
    var component = entity.set(ComponentClass, {hello: 'hi'});
    var retrieved = entity.get(ComponentClass);
    expect(component).to.equal(retrieved);
  });

  it('can be destroyed', function () {
    var entity = new Entity();
    entity.destroy();
    expect(entity.destroyed).to.be.truthy;
  });

  it('can export to JSON', function () {
    var entity = new Entity();
    entity.set(ComponentClass, {hello: 'hi'});

    var expected = {
      id: entity.id,
      destroyed: false,
      test: {hello: 'hi', entity: entity.id}
    };
    expect(JSON.stringify(entity)).to.equal(JSON.stringify(expected));
  });
});
