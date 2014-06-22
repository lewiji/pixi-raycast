var PIXI = require('../lib/pixi.dev.js'),
    Map = require('./map.js'),
    Player = require('./player.js'),
    update = require('./renderer.js'),
    Resources = require('./resources.js'),
    Config = require('./config.js'),
    UI = require('./ui.js');
// create an new instance of a pixi stage
window.stage = new PIXI.Stage(0x000000);

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(Config.screenWidth, Config.screenHeight, undefined, true, false);

renderer.view.className = 'game';

// add the renderer view element to the DOM
document.getElementById('gameContainer').appendChild(renderer.view);
var loader = new PIXI.AssetLoader(['assets/img/redbrick.png', 
                                   'assets/img/pistol.png', 
                                   'assets/img/skybox.png',
                                   'assets/img/wood.png',
                                   'assets/img/purplestone.png',
                                   'assets/img/mossy.png',
                                   'assets/img/greystone.png',
                                   'assets/img/bluestone.png',
                                   'assets/img/eagle.png',
                                   'assets/img/colorstone.png',
                                   'assets/img/barrel.png',
                                   'assets/img/greenlight.png',
                                   'assets/img/pillar.png'], 
                                   true);
loader.load();

loader.onComplete = start;

function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
}

function start () {
  // Init textures
  Resources.init();
  // add layers (DOCs)
  UI.addLayer('skybox');
  UI.addLayer('walls');
  UI.addLayer('gun');

  var sprite, walls = UI.getLayer('walls');
  // Create wall 'slice' sprites (ie rays)
  for (var x = 0; x < Config.screenWidth; x++) {
    sprite = new PIXI.Sprite(Resources.get('texture')[0][4]);
    sprite.position.x = x;
    walls.addChild(sprite);
  }

  var map = new Map();
  var player = new Player(22, 11.5, map);

  requestAnimFrame( animate );
  setInterval(function () {
    update(player);
  }, 1000/60);
}

