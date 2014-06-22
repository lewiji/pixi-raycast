var rayIdx, cameraX, rayPosX, rayPosY, rayDirX, rayDirY, mapX, mapY, 
        sideDistX, sideDistY, deltaDistX, deltaDistY, perpWallDist, stepX,
        stepY, hit, side, lineHeight, drawStart, drawEnd, color, time = 0, 
        oldTime = 0, frameTime, tint;

var Key = require('./input.js'),
    Config = require('./config.js'),
    Resources = require('./resources.js'),
    UI = require('./ui.js');

function update(camera) {
  drawWalls(camera, camera.map);
  // calculate delta time
  oldTime = time;
  time = performance.now();
  frameTime = (time - oldTime) / 1000;
  camera.update(frameTime);
}

function drawWalls(camera, map) {
  for (rayIdx = 0; rayIdx < Config.screenWidth; rayIdx++) {
    cameraX = 2 * rayIdx / Config.screenWidth - 1;
    rayPosX = camera.position.x;
    rayPosY = camera.position.y;
    rayDirX = camera.direction.x + camera.plane.x * cameraX;
    rayDirY = camera.direction.y + camera.plane.y * cameraX;
    // Which box we're in
    mapX = Math.floor(rayPosX);
    mapY = Math.floor(rayPosY);
    // Length of ray from current pos to next x or y side
    deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / 
                           (rayDirX * rayDirX));
    deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / 
                           (rayDirY * rayDirY));
    // was there a wall hit?
    hit = 0;
    // calculate step and initial sideDist
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (rayPosX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - rayPosX) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (rayPosY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - rayPosY) * deltaDistY;
    }

    while (hit == 0) {
      // jump to next map square
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      // check if ray has hit a wall
      if (map.wallGrid[Math.round(mapX)][Math.round(mapY)] > 0) {
        hit = 1;
      }
    }
    // calculate distance projected
    if (side == 0) {
      perpWallDist = Math.abs((mapX - rayPosX + (1 - stepX) / 2) / 
                              rayDirX);
    } else {
      perpWallDist = Math.abs((mapY - rayPosY + (1 - stepY) / 2) / 
                              rayDirY);
    }
    // calculate height of line
    lineHeight = Math.abs(Math.round(Config.screenHeight / perpWallDist));
    // calculate lowest and highest pixel to fill in
    drawStart = -lineHeight / 2 + Config.screenHeight / 2;
    drawEnd = lineHeight / 2 + Config.screenHeight / 2;

    if (side == 1) {
      wallX = rayPosX + ((mapY - rayPosY + (1 - stepY) / 2) / rayDirY) * rayDirX;
    } else {
      wallX = rayPosY + ((mapX - rayPosX + (1 - stepX) / 2) / rayDirX) * rayDirY;
    }
    wallX -= Math.floor(wallX);
    var line = UI.getLayer('walls').children[rayIdx];
    var texX = Math.floor(wallX * Config.texWidth);
    if (side == 0 && rayDirX > 0) {
      texX = Config.texWidth - texX - 1;
    }
    if (side == 1 && rayDirY < 0) {
      texX = Config.texWidth - texX - 1;
    }
    tint = 0xFFFFFF;
    if (side == 1) {
      tint -= 0x444444;
    }

    tint -= (0x010101 * Math.round(perpWallDist * 12));

    if (tint <= 0x000000) {
      tint = 0x000000;
    }

    line.tint = tint;
    texNum = map.wallGrid[mapX][mapY] - 1;
    line.setTexture(Resources.get('texture')[texNum][texX]);
    line.position.y = Math.floor(drawStart);
    line.height = Math.floor(drawEnd - drawStart);
  }
}

module.exports = update;