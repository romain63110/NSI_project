//import Phaser from 'phaser' //with npm

const config = {
  type: Phaser.AUTO,
  // width:window.innerWidth,
  // height:window.innerHeight,
  //pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
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

let cursors

function preload() {
  // Runs once, loads up assets like images and audio
  this.load.image("test", "src/assets/images/player1.png");
  cursors = this.input.keyboard.createCursorKeys()
}

function create() {
  // Runs once, after all assets in preload are loaded
  player = this.physics.add.sprite(400, 350,"test");
  //this.add.text(0, 0, 'Hello World', { font: '',color:'#fff' });
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene

  speed = 200
  
  // Stop any previous movement from the last frame
  player.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(100);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(100);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  
}