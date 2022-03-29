//import Phaser from 'phaser' //with npm

const config = {
  type: Phaser.AUTO,
  // width:window.innerWidth,
  // height:window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 100 },
    },
  },
  zoom: 5, // Since we're working with 16x16 pixel tiles, let's scale up the canvas by 3x
  pixelArt: true,
  scale: {
    // Fit to window
    mode: Phaser.Scale.RESIZE,
    // Center vertically and horizontally
    //autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let cursors;

function preload() {
  //to zoom
  this.game.canvas.style.width =
    (this.game.config.width * this.game.config.zoom).toString() + "px";
  this.game.canvas.style.height =
    (this.game.config.height * this.game.config.zoom).toString() + "px";

  // Runs once, loads up assets like images and audio
  this.load.image("tiles-png", "src/assets/images/tiles.png");
  this.load.image("player", "src/assets/images/player16.png");
  this.load.image("platform", "src/assets/images/platform2.png");
  //surveillance des touches clavier
  cursors = this.input.keyboard.createCursorKeys();
}

function create() {
  // Runs once, after all assets in preload are loaded

  const level = [
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0],
    [0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  13, 13, 13, 0,  0,  0,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  14, 14, 14, 14, 14, 0,  0,  0,  15],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  15, 15],
    [35, 36, 37, 0,  0,  0,  0,  0,  15, 15, 15],
    [39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39],
  ];

  const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
  const tiles = map.addTilesetImage("tiles-png");
  const worldLayer = map.createLayer(0, tiles, 0, 0);

  player = this.physics.add.sprite(16, 16, "player");
  player.body.setSize(16, 16);

  worldLayer.setCollisionBetween(12, 34);
  worldLayer.setCollisionBetween(38, 45);
  //worldLayer.setCollision();
  worldLayer.setCollisionByProperty({ collides: true });

  //debug
  const debugGraphics = this.add.graphics().setAlpha(0.75);
  worldLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(0, 255, 0, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  });

  this.physics.add.collider(player, worldLayer);
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
  //speed
  speed_x = 50;
  speed_y = 100; //jump

  // // Stop any previous movement from the last frame
  player.setVelocityX(0);

  // Horizontal movement
  

  // Vertical movement
 
    //player.play('jump', true);
  }

