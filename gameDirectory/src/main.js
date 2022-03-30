var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "AA9900", // Ouais on s'en fout mais si jamais le bgColor se met dans la config et pas dans le create()
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('greenSquare', 'assets/testSprite.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    this.add.spritesheet(400, 300, 'greenSquare');
}

/*function update() {

}*/