const config = { // configuration du phaser avec les propriétés de bases de phaser
    type: Phaser.AUTO, //moteur de rendu (WebGL par défaut, Canvas si incompatible avec un vieux navigateur comme internet explorer)
    // physics: { // physiques pour simuler une gravité
    //     default: 'arcade',
    //     arcade: {
    //     debug: true, // affichage du debug avec la hitbox et l'accélération
    //     gravity: { y: 100 }
    //     }
    // },
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            gravity: {
                y: 0.2
            },/*
            debug: {
                showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,
    
                showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,
    
                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,
    
                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,
    
                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,
    
                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,
    
                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,
    
                pinSize: 4,
                pinColor: 0x42e0e0,
    
                springColor: 0xe042e0,
    
                anchorColor: 0xefefef,
                anchorSize: 4,
    
                showConvexHulls: true,
                hullColor: 0xd703d0
            }*/
        }
    },
    input: {
        gamepad: true // fonctionalité à venir : prise en charge de manette
    },
    pixelArt: true, //retire l'anti aliasing pour éviter un effet de flou sur le pixel art
    zoom: 3,
    scale: {
        mode: Phaser.Scale.RESIZE, // fenetre adaptive
    },
    scene: { // trois fonctions principales de phaser :   
        preload: preload,// préchargement (une fois au chargement de la page, utilisé pour charger des images et autres ressources),
        create: create, //instanciations dans le code, appelée une fois apres preload()
        update: update //et réactualisation (utilisé pour la surveillance des touches), appelée en boucle
    },
}

const game = new Phaser.Game(config); //création du jeu

//HUD
var HUD = {};

HUD = function ()
{
    this.face = null;
};

HUD.prototype.constructor = HUD;

HUD.prototype = {

    preload: function ()
    {
        this.load.image('background', './src/assets/images/background.png');
    },

    create: function ()
    {
        this.face = this.add.image(0, 0, 'background').setScale(0.2, 0.2);
    }

};
var HUD_scene = game.scene.add('HUD', HUD, true);


let keyboard; // déclaration de variable, destinée à recevoir les inputs du clavier

function preload() {
    //zoom
    this.cameras.main.setZoom(this.game.config.zoom); //niveau de zoom de la caméra 

    //surveillance des touches
    keyboard = this.input.keyboard.createCursorKeys()

    //chargement de l'arrière plan
    this.load.image('background', './src/assets/images/background.png');

    //chargement du spritesheet du joueur (spritesheet=images accolées du joueurs à différentes frame pour l'animation)
    this.load.spritesheet('player', './src/assets/images/robotSprite.png', { frameWidth: 16, frameHeight: 32 });
    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('robotShapes', './src/assets/collides/robot_collides.json');
    //chargement des pixels art de tuiles
    this.load.image('tilesPng', './src/assets/tiles/tilesets.png');
    //chargement de la carte de tuile réalisée via Tiled
    this.load.tilemapTiledJSON('start', './src/assets/tiles/tilemap_start.json');
    this.load.tilemapTiledJSON('map1', './src/assets/tiles/tilemap1.json');
    this.load.tilemapTiledJSON('edgeMap', './src/assets/tiles/edge_map.json');
    // this.load.tilemapTiledJSON('map3', './src/assets/tiles/tilemap3.json');

    //chargement de la musique
    //this.music = game.add.audio('music_file');

}
function create(){
    //lancement de la musique
    //this.music.play();

    const max_y = 100;
    var map = [];
    for(i=0;i<=max_y;i++){
        map[i]=[];
    }
    var tileset = [];
    for(i=0;i<=max_y;i++){
        tileset[i]=[];
    }
    var platforms = [];
    for(i=0;i<=max_y;i++){
        platforms[i]=[];
    }
    var cables = [];
    for(i=0;i<=max_y;i++){
        cables[i]=[];
    }

    function moreMap(self,xindex,yindex,tilemapKey,collision){
        //ajout de la map
        //                              clé de la tilemap
        map[yindex][xindex] = self.make.tilemap({ key: tilemapKey });
        //                                  clé de l'image avec les tiles
        tileset[yindex][xindex] = map[yindex][xindex].addTilesetImage('tilesets',"tilesPng",16,16,0,0); //définition du tileset utilisé
        //                                                         x   y
        platforms[yindex][xindex] = map[yindex][xindex].createLayer('platforms', tileset[yindex][xindex] , xindex*16*30, yindex*16*20);//plan des platformes
        //                                                         x   y
        cables[yindex][xindex] = map[yindex][xindex].createLayer('cables', tileset[yindex][xindex] , xindex*16*30, yindex*16*20);//plan des platformes

        if(collision){
            // ajouter de la collision:
            platforms[yindex][xindex].setCollisionByProperty({ collides:true })
            self.matter.world.convertTilemapLayer(platforms[yindex][xindex]);
        }
    }

    //ajout de l'arrière plan          position   image    origine         taille
    this.background_1 = this.add.image(0, 0,'background').setOrigin(0, 0).setScale(5, 5);
    this.background_1.setScrollFactor(0.5)//valeur comparée avec la caméra pour le parallaxe

    // collision du joueur
    var shapes = this.cache.json.get('robotShapes');

    //création du joueur                  position | clé de l'image                  //for complex collision create with PhysicsEditor
    this.player = this.matter.add.sprite(1*30*16+8*16+16, 2*20*16+18*16-16, 'player','robotSprite',{shape: shapes.robotSprite});
    this.player.setScale(1) //taille du joueur
    this.player.setFixedRotation() //
    this.player.setFriction(0)
    // this.player.setFrictionStatic(0)
    // this.player.setFrictionAir(0)

    // animation du joueur
    this.anims.create({
        key: 'idle', 
        frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] }),//frames animées
        frameRate: 10, // six images par seconde
        repeat: -1 //infini
    });
    this.player.play('idle'); //on joue l'aniamtion

    const group = this.matter.world.nextGroup(true);
    const particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: true, lineColor: 0x29070D, lineOpacity: 1, fillColor: 0x29070D, fillOpacity:1,} };
    const constraintOptions = { stiffness: 0.5 };

    // softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    this.cloth = this.matter.add.softBody(700, 850, 3, 5, 1, 1, false, 1, particleOptions, constraintOptions);
    this.cloth.bodies[0].isStatic = true;
    this.cloth.bodies[4].isStatic = true;

    //ajout de la map
    //      this,xindex,yindex,name(tilemapTiledJSON),collision?
    moreMap(this,0,1,'edgeMap',false);
    moreMap(this,0,2,'edgeMap',true);
    moreMap(this,0,3,'edgeMap',false);

    moreMap(this,1,1,'edgeMap',false);
    moreMap(this,1,2,'start',true);
    moreMap(this,1,3,'edgeMap',false);
    
    moreMap(this,2,1,'edgeMap',false);
    moreMap(this,2,2,'map1',true);
    moreMap(this,2,3,'edgeMap',false);
    
    // Camera centrée sur le personnage
    this.cameras.main.startFollow(this.player,true,1,0.05);

    //debug
    console.log(this)
}
function update(){
    this.cloth.bodies[0].position.y = this.player.y-2
    this.cloth.bodies[4].position.y = this.player.y-2

    this.cloth.bodies[0].position.x = this.player.x-16+12
    this.cloth.bodies[4].position.x = this.player.x-16+7
    
    //variable vitesse
    if(true){//this.player.body.onFloor()
        speed_x = 1
    }else{
        speed_x = 1
    }
    //variable saut
    vitesseY = 3

    // //sprint
    // if(keyboard.shift.isDown && this.player.body.onFloor()){
    //     //speed_y = 3
    //     speed_x = 4
    // }
    
    // Mouvement Horizontal
    if(true){//this.player.body.onFloor()
        this.player.setVelocityX(0); // arrête le mouvement de la frame précédente
    }
    if (keyboard.left.isDown) {
        this.player.setVelocityX(-speed_x);
    } else if (keyboard.right.isDown) {
        this.player.setVelocityX(speed_x);
    }

    // Mouvement vertical
    if (keyboard.up.isDown && true) {//this.player.body.onFloor()
        this.player.setVelocityY(-vitesseY);
        //this.player.play('jump', true); /*animation de saut pas encore implémentée*/
    }
}