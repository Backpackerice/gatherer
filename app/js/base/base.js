Math.randInt = function (min, max) { return Math.floor(Math.random() * (max - min)) + min; }; // [min, max)

function  Entity () {
            Dispatcher.call(this);
            this.id = _.uniqueId('e');
            return this;
          }
          Entity.create = function (components) {
            var entity = new Entity();
            _.each(components, function (component) {
              component.register(entity);
            });
            return entity;
          };

function  Component (name) {
            this.name = name;
            Component[this.name] = {};
            return this;
          }

          Component.prototype._parent_ = Component.prototype;
          Component.prototype.register = function (entity) {
            Dispatcher.call(this, entity);
            Component[this.name][entity.id] = this; // put this component into list of components of this type
            this.entity = entity.id; // give component the entity id reference
            if (this.initialize) this.initialize();
            return this;
          };
          Component.create = function (prototype) {
            var component = _.extend(
                  prototype.constructor, {
                    get: function (eId) {
                      if (eId === undefined) return Component[this.name];
                      else if (eId instanceof Entity) return Component[this.name][eId.id];
                      else return Component[this.name][eId];
                    },
                    each: function (fn) { _.each(this.get(), fn); }
                  }
                );
                component.prototype = _.extend(new Component(component.name), prototype);

            if (prototype.define) { // Add any object definitions
              _.each(prototype.define, function (def, key) {
                Object.defineProperty(component.prototype, key, def);
              });
            }

            return component;
          };
