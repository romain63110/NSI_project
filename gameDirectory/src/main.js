const config = { // configuration du phaser avec les propriétés de bases de phaser
    type: Phaser.AUTO, //moteur de rendu (WebGL par défaut, Canvas si incompatible avec un vieux navigateur comme internet explorer)
    physics: { // physiques pour simuler une gravité
        default: 'arcade',
        arcade: {
        debug: true, // affichage du debug avec la hitbox et l'accélération
        gravity: { y: 100 }
        }
    },
    input: {
        gamepad: true // fonctionalité à venir : prise en charge de manette
    },
    pixelArt: true, //retire l'anti aliasing pour éviter un effet de flou sur le pixel art
    scale: {
        mode: Phaser.Scale.RESIZE, // fenetre adaptive
    },
    scene: { // trois fonctions principales de phaser :   
        preload: preload,// préchargement (une fois au chargement de la page, utilisé pour charger des images et autres ressources),
        create: create, //instanciations dans le code, appelée une fois apres preload()
        update: update //et réactualisation (utilisé pour la surveillance des touches), appelée en boucle
    }
}

const game = new Phaser.Game(config); //création du jeu

let keyboard; // déclaration de variable, destinée à recevoir les inputs du clavier

function preload() {
    //zoom
    this.cameras.main.setZoom(2); //niveau de zoom de la caméra 

    //surveillance des touches
    keyboard = this.input.keyboard.createCursorKeys()

    //chargement de l'arrière plan
    this.load.image('background', './src/assets/images/background.png');

    //chargement du spritesheet du joueur (spritesheet=images accolées du joueurs à différentes frame pour l'animation)
    this.load.spritesheet('player', './src/assets/images/testSprite.png', { frameWidth: 32, frameHeight: 32 });
    //chargement des pixels art de tuiles
    this.load.image('tilesPng', './src/assets/tiles/tilesimage1.png');
    //chargement de la carte de tuile réalisée via Tiled
    this.load.tilemapTiledJSON('map1', './src/assets/tiles/tilemap1.json');
    this.load.tilemapTiledJSON('map2', './src/assets/tiles/tilemap2.json');
    this.load.tilemapTiledJSON('map3', './src/assets/tiles/tilemap2.json');
    //chargement de la musique
    //this.music = game.add.audio('music_file');

}
function create(){
    //lancement de la musique
    //this.music.play();

    var map = [];
    var tileset = [];
    var platforms = [];

    function moreMap(self,index,tilemapKey){
        //ajout de la map
        //                              clé de la tilemap
        map[index] = self.make.tilemap({ key: tilemapKey });
        //                                  clé de l'image avec les tiles
        tileset[index] = map[index].addTilesetImage('tileimage',"tilesPng",16,16,0,0); //définition du tileset utilisé
        //                                                         x   y
        platforms[index] = map[index].createLayer('platforms', tileset[index] , index*16*30, 200);//plan des platformes

        // ajouter de la collision aux plateformes:
        platforms[index].setCollision([1,2,3,57,58,59,]); 
        self.physics.add.collider(self.player, platforms[index]);
    }

    //ajout de l'arrière plan          position   image    origine         taille
    this.background_1 = this.add.image(0, 0,'background').setOrigin(0, 0).setScale(2, 2);
    this.background_1.setScrollFactor(0.5)//valeur comparée avec la caméra pour le parallaxe

    //création du joueur                  position | clé de l'image
    this.player = this.physics.add.sprite(100, 300, 'player');
    this.player.setScale(1) //taille du joueur
    // animation du joueur
    this.anims.create({
        key: 'idle', 
        frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3, 4, 5, ] }),//frames animées
        frameRate: 12, // douze images par seconde
        repeat: -1 //infini
    });
    this.player.play('idle'); //on joue l'aniamtion

    //ajout de la map
    moreMap(this,0,'map1');
    moreMap(this,1,'map2');
    moreMap(this,2,'map3');
    
    // Camera centrée sur le personnage
    this.cameras.main.startFollow(this.player,true,1,0.05);

    console.log(this) 
}
function update(){
    //variable vitesse
    if(this.player.body.onFloor()){
        speed_x = 50
    }else{
        speed_x = 50
    }
    //variable saut
    vitesseY = 100 

    // //sprint
    // if(keyboard.shift.isDown && this.player.body.onFloor()){
    //     //speed_y = 300 
    //     speed_x = 100
    // }
    
    // Mouvement Horizontal
    if(this.player.body.onFloor()){
        this.player.setVelocityX(0); // arrête le mouvement de la frame précédente
    }
    if (keyboard.left.isDown) {
        this.player.body.setVelocityX(-speed_x);
    } else if (keyboard.right.isDown) {
        this.player.body.setVelocityX(speed_x);
    }

    // Mouvement vertical
    if ((keyboard.up.isDown) && this.player.body.onFloor()) {
        this.player.setVelocityY(-vitesseY);
        //this.player.play('jump', true); /*animation de saut pas encore implémentée*/
    }
}