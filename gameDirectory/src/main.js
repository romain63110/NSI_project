let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "AA9900", // Ouais on s'en fout mais si jamais le bgColor se met dans la config et pas dans le create()
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('greenSquare', 'assets/testSprite.png');
}

function create() {
    this.add.image(0, 0, 'greenSquare');
}

function update() {

}