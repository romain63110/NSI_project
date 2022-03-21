import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  // width:window.innerWidth,
  // height:window.innerHeight,
  //pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scale: {
    // Fit to window
    mode: Phaser.Scale.RESIZE,
    // Center vertically and horizontally
    // autoCenter: Phaser.Scale.CENTER_BOTH
},
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

const game = new Phaser.Game(config);

function preload() {
  // Runs once, loads up assets like images and audio
}

function create() {
  // Runs once, after all assets in preload are loaded
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
}