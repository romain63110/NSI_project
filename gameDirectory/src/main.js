const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
        debug: true,
        gravity: { y: 100 }
        }
    },
    input: {
        gamepad: true
    },
    zoom: 1,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

const game = new Phaser.Game(config);

let keyboard;

function preload() {
    //to zoom
    this.cameras.main.setZoom(this.game.config.zoom);

    //keyboard
    keyboard = this.input.keyboard.createCursorKeys()

    //load background image
    this.load.image('background', './src/assets/images/background.jpg');

    //load player with JSON(to animate)
    this.load.image('player', './src/assets/images/player.png');

    // load tiles(image)
    this.load.image('tiles', './src/assets/tiles/images/tiles.png');
    // load tiles(JSON export)
    this.load.tilemapTiledJSON('map', './src/assets/tiles/json/tilemap.json'); // tmj ~= json

}
function create(){
    //add background                      position   image    origin->position   scale
    const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0).setScale(0.5, 0.5);

    //add player                         position    image
    this.player = this.physics.add.sprite(50, 300, 'player');

    //add map
    //                              key of tilemapTiledJSON
    const map = this.make.tilemap({ key: 'map' });
    //                                  key of tile image
    const tileset = map.addTilesetImage('tiles');

    const platforms = map.createLayer('platform', tileset, 0, 200);//layer: platform
    map.createLayer('creeper', tileset, 0, 200);                   //layer: creeper

    // adds colision to tiles 1
    platforms.setCollision(1); 


    //                                     tiles where colision is true
    this.physics.add.collider(this.player, platforms);
    //Camera
    this.cameras.main.startFollow(this.player,true,1,0.05);//(player,arround position,x,y)

}
function update(){
    //speed
    speed_x = 50
    speed_y = 100 //jump

    // Horizontal movement
    this.player.setVelocityX(0);// stop any previous movement from the last frame
    if (keyboard.left.isDown) {
        this.player.body.setVelocityX(-speed_x);
    } else if (keyboard.right.isDown) {
        this.player.body.setVelocityX(speed_x);
    }

    // Vertical movement
    if ((keyboard.up.isDown) && this.player.body.onFloor()) {
        this.player.setVelocityY(-speed_y);
        //player.play('jump', true);
    }
}