var PIXI = require('../lib/pixi.dev.js'),
    Config = require('./config.js');
var Resources = {
    pool: {},
    init: function () {
        var texture = [[], [], [], [], [], [], [], []];
        var brick = PIXI.BaseTexture.fromImage('assets/img/redbrick.png'),
            wood = PIXI.BaseTexture.fromImage('assets/img/wood.png'),
            purpstone = PIXI.BaseTexture.fromImage('assets/img/purplestone.png'),
            mossy = PIXI.BaseTexture.fromImage('assets/img/mossy.png'),
            grey = PIXI.BaseTexture.fromImage('assets/img/greystone.png'),
            blue = PIXI.BaseTexture.fromImage('assets/img/bluestone.png'),
            eagle = PIXI.BaseTexture.fromImage('assets/img/eagle.png'),
            color = PIXI.BaseTexture.fromImage('assets/img/colorstone.png');
        for (var x = 0; x < Config.texWidth; x++) {
            texture[0][x] = new PIXI.Texture(eagle, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[1][x] = new PIXI.Texture(brick, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[2][x] = new PIXI.Texture(purpstone, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[3][x] = new PIXI.Texture(grey, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[4][x] = new PIXI.Texture(blue, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[5][x] = new PIXI.Texture(mossy, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[6][x] = new PIXI.Texture(wood, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[7][x] = new PIXI.Texture(color, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
        }
        this.store('texture', texture);
        var gunTexture = [];
        var gunBase = PIXI.BaseTexture.fromImage('assets/img/pistol.png');
        for (var i = 0; i < 3; i++) {
          gunTexture[i] = new PIXI.Texture(gunBase, new PIXI.Rectangle(i * 145, 0, 145, 145));
        }
        this.store('gun', gunTexture);
    },
    store: function (name, resource) {
        this.pool[name] = resource;
    },
    get: function (name) {
        return this.pool[name];
    }
}

module.exports = Resources;