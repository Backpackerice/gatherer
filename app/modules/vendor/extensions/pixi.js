var PIXI = require('../pixi.dev.js');
PIXI.DisplayObjectContainer.prototype.contains = function(child)
{
    return (this.children.indexOf( child ) !== -1);
}

if (module && module.exports) module.exports = PIXI;