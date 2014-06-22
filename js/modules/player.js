var Camera = require('./camera.js'),
    Key = require('./input.js'),
    UI = require('./ui.js')
    Resources = require('./resources.js'),
    PIXI = require('../lib/pixi.dev.js'),
    Config = require('./config.js');

var Player = function (x, y, map) {
    this.position.x = x;
    this.position.y = y;
    this.map = map;
    this.gun = new PIXI.MovieClip(Resources.get('gun'));
    UI.getLayer('gun').addChild(this.gun);
    this.gun.position.y = Config.screenHeight - 140;
    this.gun.position.x = (Config.screenWidth / 2);
    this.gunPos = Config.screenHeight - 140;
    this.gun.scale = {x: 1.5, y: 1.5};
    this.gun.animationSpeed = 0.28;
    this.gun.loop = false;
    this.gunDy = 0;

    this.gun.onComplete = function () {
      setTimeout(function () {
        this.gunFiring = false;
      }.bind(this), 200);
      this.gun.gotoAndStop(0);
    }.bind(this);
}

Player.prototype = new Camera(0, 0); 
Player.prototype.constructor = Player;

Player.prototype.update = function (frameTime) {
    this.moveSpeed = frameTime * 5;
    this.rotSpeed = frameTime * 3;
    this.moveGun = false;
    if (Key.isDown(Key.UP)) {
      this.moveGun = true;
      if (this.map.wallGrid[Math.floor(this.position.x + this.direction.x * this.moveSpeed * 4)]
                      [Math.floor(this.position.y)] == false) {
        this.position.x += this.direction.x * this.moveSpeed;
      }
      if (this.map.wallGrid[Math.floor(this.position.x)]
                      [Math.floor(this.position.y + this.direction.y * this.moveSpeed * 4)] == false) {
        this.position.y += this.direction.y * this.moveSpeed;
      }
    }

    if (Key.isDown(Key.DOWN)) {
      this.moveGun = true;
      if (this.map.wallGrid[Math.floor(this.position.x - this.direction.x * this.moveSpeed * 4)]
                      [Math.floor(this.position.y)] == false) {
        this.position.x -= this.direction.x * this.moveSpeed;
      }
      if (this.map.wallGrid[Math.floor(this.position.x)]
                      [Math.floor(this.position.y - this.direction.y * this.moveSpeed * 4)] == false) {
        this.position.y -= this.direction.y * this.moveSpeed;
      }
    }

    if (Key.isDown(Key.RIGHT)) {
      this.map.skybox.tilePosition.x -= 1000 * frameTime;
      this.oldDirX = this.direction.x;
      this.direction.x = this.direction.x * Math.cos(-this.rotSpeed) - this.direction.y * Math.sin(-this.rotSpeed);
      this.direction.y = this.oldDirX * Math.sin(-this.rotSpeed) + this.direction.y * Math.cos(-this.rotSpeed);
      this.oldPlaneX = this.plane.x;
      this.plane.x = this.plane.x * Math.cos(-this.rotSpeed) - this.plane.y * Math.sin(-this.rotSpeed);
      this.plane.y = this.oldPlaneX * Math.sin(-this.rotSpeed) + this.plane.y * Math.cos(-this.rotSpeed);
    }

    if (Key.isDown(Key.LEFT)) {
      this.map.skybox.tilePosition.x += 1000 * frameTime;
      this.oldDirX = this.direction.x;
      this.direction.x = this.direction.x * Math.cos(this.rotSpeed) - this.direction.y * Math.sin(this.rotSpeed);
      this.direction.y = this.oldDirX * Math.sin(this.rotSpeed) + this.direction.y * Math.cos(this.rotSpeed);
      this.oldPlaneX = this.plane.x;
      this.plane.x = this.plane.x * Math.cos(this.rotSpeed) - this.plane.y * Math.sin(this.rotSpeed);
      this.plane.y = this.oldPlaneX * Math.sin(this.rotSpeed) + this.plane.y * Math.cos(this.rotSpeed);
    }

    if (!this.gunFiring && Key.isDown(Key.SPACE)) {
      this.gun.play();
      this.gunFiring = true;
      this.gunDy += 30;

      if (this.gunDy > 75) {
        this.gunDy = 50;
      }
    }

    if (this.moveGun) {
      if (this.gunUp && this.gunDy < 8) {
        this.gunDy += 35 * frameTime;
      } else {
        this.gunUp = false;
      }

      if (!this.gunUp && this.gunDy > -3) {
        this.gunDy -= 45 * frameTime;
      } else {
        this.gunUp = true;
      }

      if (this.gunDy > 12) {
        this.gunDy -= 2;
      } 
      if (this.gunDy < -7) {
        this.gunDy += 2;
      }
    } else {
      if (this.gunDy > 3) {
        this.gunDy -= 2;
      } 
      if (this.gunDy < -3) {
        this.gunDy += 2;
      }
      this.gunUp = true;
    }
    this.gun.position.y = this.gunPos - this.gunDy;
};

module.exports = Player;