
function BlockInfo(rows, cols) {
  this.size = [rows, cols];
  this.rivers = [];
}

BlockInfo.prototype.addRiver = function (point, direction, speed) {
  this.rivers.push({
    point: point,
    direction: direction,
    speed: speed
  });
};

function generateBlock(blockInfo) {
  var size = blockInfo.size;
  var map = new Array(size[0] * size[1]);

  blockInfo.rivers.forEach(function(river) {
    generateRiver(map, blockInfo, river);
  });

  return map;
}

function generateRiver(blockMap, blockInfo, riverInfo) {
  var size = blockInfo.size;
  var point = [riverInfo.point[0], riverInfo.point[1]];
  var delta = [riverInfo.direction[0], riverInfo.direction[1]];
  var speed = riverInfo.speed;

  var tick = 0;
  var check = function () {
    return point[0] < blockInfo.size[0] && point[0] >= 0 &&
        point[1] < blockInfo.size[1] && point[1] >= 0;
  };

  while (check() && tick < size[0] * size[1]) {
    blockMap[Math.floor(point[1]) * size[0] + Math.floor(point[0])] = 'river';
    speed = [speed[0] * 0.5, speed[1] * 0.5];
    delta = normalize([riverInfo.direction[0] * speed[0], riverInfo.direction[1] * speed[1]]);
    point = [point[0] + delta[0], point[1] + delta[1]];
    tick++;
  }
}

function printMap(map, blockInfo) {
  var lines = [];
  var line = '';

  for (var i = 0; i < map.length; i++) {
    if (!(i % blockInfo.size[0]) && line) {
      lines.push(line);
      line = '';
    }
    line += (map[i] ? map[i][0] : ' ');
  }
  return lines.join('\n');
}

function normalize(vec) {
  var magn2 = vec[0] * vec[0] + vec[1] * vec[1];
  if (!magn2) return vec;

  var magn = Math.sqrt(magn2);
  return [vec[0]/magn, vec[1]/magn];
}

module.exports = {
  BlockInfo,
  generateBlock,
  printMap,
};
