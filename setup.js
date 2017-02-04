const fs = require('fs');
const Canvas = require('canvas');
const PlantTexture = require('plant-texture');

const herbCanvas = new Canvas();
const herbData = {
  type: 'herb',
  stemTypes: [0, 1, 2, 3],
  stemGrowths: [5, 10, 20, 30, 40, 50, 60, 70, 80]
};
const herbs = new PlantTexture(herbCanvas, Canvas.ImageData);

herbs.generateStems(herbData);
fs.writeFileSync('assets/herbs.json', JSON.stringify(herbs, null, 2));
fs.writeFileSync('assets/herbs.png', herbCanvas.toBuffer());
