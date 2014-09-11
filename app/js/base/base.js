Math.randInt = function (min, max) { return Math.floor(Math.random() * (max - min)) + min; }; // [min, max)

function  Entity () { this.id = _.uniqueId('e'); return this; }

function  Component (name) {
            this.name = name;
            Component[this.name] = {};
            return this;
          }

          Component.prototype.register = function (entity) {
            Component[this.name][entity.id] = this; // put this component into list of components of this type
            this.entity = entity.id; // give component the entity id reference
            if (this.initialize) this.initialize();
            return this;
          };
          Component.create = function (prototype) {
            var component = _.extend(prototype.constructor, {
              get: function (eId) { // static level
                if (eId === undefined) return Component[this.name];
                else return Component[this.name][eId];
              },
              each: function (fn) { _.each(this.get(), fn); }
            });
            component.prototype = _.extend(new Component(component.name), prototype);
            return component;
          };
