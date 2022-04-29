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
    zoom: 5,
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
    this.load.image('background', './src/assets/images/background.png');

    //load player with JSON(to animate)
    this.load.image('player', './src/assets/images/player.png');

    // load tiles(image)
    this.load.image('tiles', './src/assets/tiles/tiles.png');
    // load tiles(JSON export)
    this.load.tilemapTiledJSON('map', './src/assets/tiles/tilemap.json'); // tmj ~= json

}
function create(){
    //add background                      position   image    origin->position   scale
    this.background_1 = this.add.image(0, 0,'background').setOrigin(0, 0).setScale(2, 2);
    this.background_1.setScrollFactor(0.5)//Compared to the camera//parallax

    //add player                         position    image
    this.player = this.physics.add.sprite(70, 300, 'player');
    this.player.setScale(0.2)

    //add map
    //                              key of tilemapTiledJSON
    const map = this.make.tilemap({ key: 'map' });
    //                                  key of tile image
    const tileset = map.addTilesetImage('tileimage',"tiles",16,16,0,0);

    const platforms = map.createLayer('platforms', tileset, 0, 200);//layer: platform
    //map.createLayer('creeper', tileset, 0, 200);                   //layer: creeper

    // adds colision to tiles 1
    platforms.setCollision([0,1,2,3,4,5,6,7,8,285,57,58,59]); 


    //                                     tiles where colision is true
    this.physics.add.collider(this.player, platforms);
    //Camera
    this.cameras.main.startFollow(this.player,true,1,0.05);//(player,arround position,x,y)
    console.log(this)
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