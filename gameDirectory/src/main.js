const config = {
    width: innerWidth,
    height: innerHeight,
    type: Phaser.AUTO,
    backgroundColor: '#121212',
    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 1}
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
    this.load.image('pacman', 'assets/pacman.png');
}

function create() {
    this.matter.world.setBounds(0, 0, config.width, config.height)
    pacman = this.matter.add.sprite(150, 150, 'pacman');

    spaceBar = this.input.keyboard.addKey('SPACE');
    qKey = this.input.keyboard.addKey('Q');
    dKey = this.input.keyboard.addKey('D');
}

function update() {
    pacman.setVelocityX(0);

    if(spaceBar.isDown && dKey.isDown) {
        pacman.setVelocity(5, -5)
    }

    if(spaceBar.isDown) {
        pacman.setVelocity(0, -5);
    }

    if(dKey.isDown) {
        pacman.setVelocity(5, 0);
    }

    if(qKey.isDown) {
        pacman.setVelocity(-5, 0);
    }
}