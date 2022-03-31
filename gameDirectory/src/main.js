const config = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    backgroundColor: '#121212',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let pacman; // oui je sais c'est pas un pacman l'image et aussi c'est tout petit mais je m'en fous
let spaceBar;
let qKey;
let dKey;

function preload() {
    this.load.image('pacman', 'pacman.png');
}

function create() {
    pacman = this.physics.add.sprite(150, 150, 'pacman');
    pacman.body.collideWorldBounds = true;

    spaceBar = this.input.keyboard.addKey('SPACE');
    qKey = this.input.keyboard.addKey('Q');
    dKey = this.input.keyboard.addKey('D');
}

function update() {
    pacman.setVelocityX(0);

    if(spaceBar.isDown) {
        pacman.setVelocity(0, -200);
    }

    if(dKey.isDown) {
        pacman.setVelocity(100, 20);
    }

    if(qKey.isDown) {
        pacman.setVelocity(-100, 20);
    }
}