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
                y: 0.7
            },
            debug: false,
			debug: {
                // showAxes: false,
                // showAngleIndicator: true,
                // angleColor: 0xe81153,

                // showBroadphase: false,
                // broadphaseColor: 0xffb400,

                // showBounds: false,
                // boundsColor: 0xffffff,

                // showVelocity: true,
                // velocityColor: 0x00aeef,

                // showCollisions: true,
                // collisionColor: 0xf5950c,
    
                // showSeparations: false,
                // separationColor: 0xffa500,

                // showBody: true,
                // showStaticBody: true,
                // showInternalEdges: true,

                // renderFill: false,
                // renderLine: true,
    
                // fillColor: 0x106909,
                // fillOpacity: 1,
                // lineColor: 0x28de19,
                // lineOpacity: 1,
                // lineThickness: 1,
    
                // staticFillColor: 0x0d177b,
                // staticLineColor: 0x1327e4,

                // showSleeping: true,
                // staticBodySleepOpacity: 1,
                // sleepFillColor: 0x464646,
                // sleepLineColor: 0x999a99,
    
                // showSensors: true,
                // sensorFillColor: 0x0d177b,
                // sensorLineColor: 0x1327e4,
    
                // showPositions: true,
                // positionSize: 4,
                // positionColor: 0xe042da,
    
                // showJoint: true,
                // jointColor: 0xe0e042,
                // jointLineOpacity: 1,
                // jointLineThickness: 2,
    
                // pinSize: 4,
                // pinColor: 0x42e0e0,
    
                // springColor: 0xe042e0,
    
                // anchorColor: 0xefefef,
                // anchorSize: 4,
    
                // showConvexHulls: true,
                // hullColor: 0xd703d0,
				
				// gameInfo: true,
				// gameTimeInfo: true
            }
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

HUD = function (){};

HUD.prototype.constructor = HUD;

HUD.prototype = {

    preload: function ()
    {
        this.load.image('background', './src/assets/images/background.png');
        this.load.image('playButton', './src/assets/images/playButton.png');
        this.load.image('resumeButton', './src/assets/images/resumeButton.png');
        this.load.image('settingsButton', './src/assets/images/settingsButton.png');
    },

    create: function ()
    {
        this.playButton = this.add.image(innerWidth / 2, innerHeight / 3.5, 'playButton').setScale(3, 3);
        this.resumeButton = this.add.image(innerWidth / 2, innerHeight / 2.5, 'resumeButton').setScale(3, 3);
        this.settingsButton = this.add.image(innerWidth / 1.05, innerHeight / 15, 'settingsButton').setScale(3, 3);
    },

    // update: function () //TOUT CA PLANTE QUAND ON CLIQUE !!
    // {
    //     let pointer = this.input.activePointer; // permet en gros la détection de la souris

    //     if(pointer.isDown){ // quand on clique (malheureusement j'arrive pas à def une zone) ça change la teinte
    //         playButton.setTint(0x333333 ); 
    //     }
    //     else if(pointer.isUp){ // et quand on relache c'est censé remettre l'image normale
    //         this.playButton = this.add.image(innerWidth / 2, innerHeight / 3.5, 'playButton').setScale(3, 3);
    //     }
        
    // }

    

};
var HUD_scene = game.scene.add('HUD', HUD, true);


let keyboard; // déclaration de variable, destinée à recevoir les inputs du clavier
let player;
lastXCollisionx = 0;//collision
lastXCollisiony = 0;//collision
// debugXCollisionx = 0;//collision debug
// debugXCollisiony = 0;//collision debug

function preload() {
    //zoom
    this.cameras.main.setZoom(this.game.config.zoom); //niveau de zoom de la caméra 

    //surveillance des touches
    keyboard = this.input.keyboard.createCursorKeys()

    //chargement de l'arrière plan
    this.load.image('background', './src/assets/images/background.png');

    //chargement du spritesheet du joueur (spritesheet=images accolées du joueurs à différentes frame pour l'animation)
    this.load.spritesheet('playerIdle', './src/assets/images/robotSprite.png', { frameWidth: 16, frameHeight: 32 });
    //chargement du spritesheet du joueur (spritesheet=images accolées du joueurs à différentes frame pour l'animation)
    this.load.spritesheet('playerRun', './src/assets/images/robotSprite_run.png', { frameWidth: 48, frameHeight: 38 });

    //chargement du spritesheet de l'ennemi (spritesheet=images accolées du joueurs à différentes frame pour l'animation)
    this.load.spritesheet('enemyRunR', './src/assets/images/spritesheetArachnobot3-sheet.png', { frameWidth: 64, frameHeight: 48 });  //anim course droite
    this.load.spritesheet('enemyRunL', './src/assets/images/gameDirectory/spritesheetArachnobot3-sheet_movingLeft.png', { frameWidth: 64, frameHeight: 48 });  //anim course gauche
    this.load.spritesheet('enemyIdle', './src/assets/images/spritesheetArachnobot_Idle.png', { frameWidth: 64, frameHeight: 48 });  //anim passive

    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('robotShapes', './src/assets/collides/robot_collides_rounded.json');
    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('enemyShapes', './src/assets/collides/enemy_collision.json');
    //chargement des pixels art de tuiles
    this.load.image('tilesPng', './src/assets/tiles/tilesets.png');
    //chargement de la carte de tuile réalisée via Tiled
    this.load.tilemapTiledJSON('start', './src/assets/tiles/tilemap_start.json');
    this.load.tilemapTiledJSON('map_1', './src/assets/tiles/tilemap1.json');
    this.load.tilemapTiledJSON('edgeMap', './src/assets/tiles/edge_map.json');

    this.load.tilemapTiledJSON('startMap', './src/testTiles/MapJules/mapStart.json');
    this.load.tilemapTiledJSON('map1', './src/testTiles/MapJules/map1.json');
    this.load.tilemapTiledJSON('map2', './src/testTiles/MapJules/map2.json');
    this.load.tilemapTiledJSON('map3', './src/testTiles/MapJules/map3.json');
    this.load.tilemapTiledJSON('map4', './src/testTiles/MapJules/map4.json');
    this.load.tilemapTiledJSON('map5', './src/testTiles/MapJules/map5.json');
    this.load.tilemapTiledJSON('map6', './src/testTiles/MapJules/map6.json');
    this.load.tilemapTiledJSON('map7', './src/testTiles/MapJules/map7.json');
    this.load.tilemapTiledJSON('endMap', './src/testTiles/MapJules/mapFinal.json');
    // this.load.tilemapTiledJSON('map3', './src/assets/tiles/tilemap3.json');

    //chargement de la musique
    this.load.audio('ost', './src/assets/musics/OST-NSI1.mp3');

}

// class EnemyPlugin extends Phaser.Plugins.BasePlugin {

//     constructor (pluginManager)
//     {
//         super(pluginManager);

//         //  Register our new Game Object type
//         pluginManager.registerGameObject('enemy', this.createEnemy);
//     }

//     createEnemy (x, y)
//     {
//         return this.displayList.add(new EnemyGameObject(this.scene, x, y));
//     }

// }

function create(){
    //lancement de la musique
    let music = this.sound.add('ost');
    music.play({loop: true, volume: 0.2});

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
    var spikes = [];
    for(i=0;i<=max_y;i++){
        spikes[i]=[];
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
        //                                                         x   y
        spikes[yindex][xindex] = map[yindex][xindex].createLayer('spikes', tileset[yindex][xindex] , xindex*16*30, yindex*16*20);//plan des platformes

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
    player_matter = this.matter.add.sprite(1*30*16+8*16+16, 2*20*16+18*16-16, 'player','robotSprite',{shape: shapes.robotSprite}).setOrigin(0.5,0.5);
    player_matter.setScale(1) //taille du joueur
    player_matter.setFixedRotation() //
    player_matter.setFriction(0)
    // player.setFrictionStatic(0)
    // player.setFrictionAir(0)

    player = player_matter || {};
    player.onTheFloor = true;
    player.collisionRightWall = false;
    player.collisionLeftWall = false;
    
    // animation idle du joueur
    this.anims.create({
        key: 'idle', 
        frames: this.anims.generateFrameNumbers('playerIdle', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] }),//frames animées
        frameRate: 10, // six images par seconde
        repeat: -1 //infini
    });
    player.play('idle'); //on joue l'aniamtion
    
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] }),//frames animées
        frameRate: 6,
        repeat: -1

    });
    

    // const group = this.matter.world.nextGroup(true);
    // const particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: true, lineColor: 0x29070D, lineOpacity: 1, fillColor: 0x29070D, fillOpacity:1,} };
    // const constraintOptions = { stiffness: 0.5 };

    // softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    // this.cloth = this.matter.add.softBody(700, 850, 3, 5, 1, 1, false, 1, particleOptions, constraintOptions);
    // this.cloth.bodies[0].isStatic = true;
    // this.cloth.bodies[4].isStatic = true;

    //ajout de la map
    //      this,xindex,yindex,name(tilemapTiledJSON),collision?
    moreMap(this,0,1,'edgeMap',false);
    moreMap(this,0,2,'edgeMap',true);
    moreMap(this,0,3,'edgeMap',false);

    moreMap(this,1,1,'edgeMap',false);
    moreMap(this,1,2,'startMap',true);
    moreMap(this,1,3,'edgeMap',false);
    
    moreMap(this,2,1,'edgeMap',false);
    moreMap(this,2,2,'map_1',true);
    moreMap(this,2,3,'edgeMap',false);
    
    // Camera centrée sur le personnage
    this.cameras.main.startFollow(player,true,1,0.05);

    //collsion x,y objet en mouvement , x,y objet statique
    function detectOnTheFloor(Ax,Ay,Bx,By,demi_collision_box,demi_largeur_tiles,tolerance){
        if( Bx-demi_largeur_tiles-demi_collision_box-tolerance < Ax && Ax < Bx+demi_largeur_tiles+demi_collision_box+tolerance){//BodyA
            lastXCollisionx = Bx;
            lastXCollisiony = By;
        }
        if(Ay < lastXCollisiony && (Ay - lastXCollisiony)<=16){// 16 -> distance entre le centre d'une tile est le centre du perso(quand il est sur le sol)
            // console.log('onTheFloor')
            return true;
        }
    }

    function detectWallCollision(Ax,Ay,Bx,By,collision_height,setCollisionLeftWall,setCollisionRightWall){
        //console.log(By-Ay-collision_height-(By-Ay+collision_height)/2) // 8-> distance Ax Bx max
        if(Ay+collision_height > By && By > Ay-collision_height){//collision avec un mur detecter
            if(Bx < Ax){
                //console.log('left')
                setCollisionLeftWall(true)
            }else if(Bx > Ax){
                // console.log('right')
                setCollisionRightWall(true)
            }
        }else{
            // console.log('reset reset reset')
            setCollisionLeftWall(false)
            setCollisionRightWall(false)
            //console.log(By-8-Ay)
        }
        // debugXCollisionx=Bx;//collision debug
        // debugXCollisiony=By;//collision debug
    }

    function player_collision_detector(bodyA, bodyB){
        const demi_collision_box = 3.95;//distance entre le centre est le bord de la colision     //detectOnTheFloor
        const demi_largeur_tiles=16/2;                                                            //detectOnTheFloor
        const collision_height = 16;//tiles height     //hauteur de l'origine du perso            //detectWallCollision
        const tolerance = 1;                                                                      //detectOnTheFloor

        if(bodyA.parent.label == 'robotSprite'){

            player.onTheFloor = detectOnTheFloor(bodyA.position.x,bodyA.position.y,bodyB.position.x,bodyB.position.y,demi_collision_box,demi_largeur_tiles,tolerance);
            detectWallCollision(bodyA.position.x,bodyA.position.y,bodyB.position.x,bodyB.position.y,collision_height,(val)=>{player.collisionLeftWall = val;player.anims.play('idle',true);},(val)=>{player.collisionRightWall = val;player.anims.play('idle',true);})
            
        }
    }

    function onCollisionDetected(bodyA, bodyB){
        //console.log(bodyA.label+"   "+bodyB.label)
        player_collision_detector(bodyA, bodyB);
        enemy_collision_detector(bodyA, bodyB);
    }

    this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
        onCollisionDetected(bodyA, bodyB);
    });
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        onCollisionDetected(bodyA, bodyB);
    });

    // collision du joueur
    var enemy_shapes = this.cache.json.get('enemyShapes');
    enemy_matter = this.matter.add.sprite(1*30*16+8*16+16*4, 2*20*16+18*16-16*4, 'enemy','enemySprite',{shape: enemy_shapes.enemySprite}).setOrigin(0.5,0.5);
    enemy_matter.setScale(0.5); //taille de l'ennemi
    enemy_matter.setFixedRotation(); //
    enemy_matter.setFriction(0);
    enemy_matter.setVelocityX(1);

    enemy = enemy_matter || {};
    enemy.onTheFloor = true;
    enemy.collisionRightWall = false;
    enemy.collisionLeftWall = false;
    enemy.lastVelocityX = 1;

    function enemy_collision_detector(bodyA, bodyB){
        const demi_collision_box = 8;//distance entre le centre est le bord de la colision       //detectOnTheFloor
        const demi_largeur_tiles=16/2;                                                           //detectOnTheFloor
        const collision_height = 12.442;//hauteur de l'origine du perso                               //detectWallCollision
        const tolerance = 1;                                                                     //detectOnTheFloor
        
        //console.log(bodyA.parent.label)
        if(bodyB.parent.label == 'enemySprite'){
            enemy.onTheFloor = detectOnTheFloor(bodyB.position.x,bodyB.position.y,bodyA.position.x,bodyA.position.y,demi_collision_box,demi_largeur_tiles,tolerance);
            detectWallCollision(bodyB.position.x,bodyB.position.y,bodyA.position.x,bodyA.position.y,collision_height,(val)=>{enemy.collisionLeftWall = val;},(val)=>{enemy.collisionRightWall = val;})
            // console.log("collisionLeftWall  "+enemy.collisionLeftWall)//collision debug
            // console.log("collisionRightWall  "+enemy.collisionRightWall)//collision debug
            // console.log("onTheFloor  "+enemy.onTheFloor)//collision debug
        }
    }
    
    
    
    // animation attaque/mouvement de l'ennemi
    this.anims.create({
        key: 'enemyIdleAnimation',
        frames: this.anims.generateFrameNumbers('enemyIdle', { frames:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39/*, 40*/] }),//frames animées
        frameRate: 40,
        repeat: -1

    });
    this.anims.create({
        key: 'enemyRunRightAnimation',
        frames: this.anims.generateFrameNumbers('enemyRunR', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] }),//frames animées
        frameRate: 13,
        repeat: -1

    });
    this.anims.create({
        key: 'enemyRunLeftAnimation',
        frames: this.anims.generateFrameNumbers('enemyRunL', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9/*, 10, 11, 12*/ ] }),//frames animées
        frameRate: 9,
        repeat: -1

    });
    enemy_matter.anims.play('enemyIdleAnimation',true); //on joue l'aniamtion

    //debug
    console.log(this);
    console.log(player);
    console.log(this.test1);
    // this.test1 = this.add.text(0, 0, '+', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize:35 }).setOrigin(0.5,0.5); //collision debug
    // this.test2 = this.add.text(0, 0, '+', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize:35 }).setOrigin(0.5,0.5); //collision debug
}
function update(){
    // this.cloth.bodies[0].position.y = player.y-2
    // this.cloth.bodies[4].position.y = player.y-2

    // this.cloth.bodies[0].position.x = player.x-16+12
    // this.cloth.bodies[4].position.x = player.x-16+7
    
    //variable vitesse
    if(player.onTheFloor){
        speed_x = 1.4;
    }else{
        speed_x = 1.9;
    }
    //variable saut
    vitesseY = 5;

    if(enemy.collisionRightWall){// touche le mur droit
        // console.log("go left");//collision debug
        enemy.setVelocityX(-1);
        enemy.lastVelocityX = -1;
        //enemy.anims.play('enemyRunLeftAnimation',true); //on joue l'aniamtion
    }else if(enemy.collisionLeftWall){// touche le mur gauche
        // console.log("go right");//collision debug
        enemy.setVelocityX(1);
        enemy.lastVelocityX = 1;
        enemy_matter.anims.play('enemyRunRightAnimation',true); //on joue l'aniamtion
    }else{
        enemy.setVelocityX(enemy.lastVelocityX)
    }

    // this.test1.x = enemy_matter.x;//collision debug
    // this.test1.y = enemy_matter.y;//collision debug
    // this.test2.x = debugXCollisionx;//collision debug
    // this.test2.y = debugXCollisiony;//collision debug

    
    // Mouvement Horizontal
    if(player.onTheFloor){
        player.setVelocityX(0); // arrête le mouvement de la frame précédente
    }
    if (keyboard.left.isDown /*&& !player.collisionLeftWall*/) {
        //player.collisionRightWall = false;
        if(!player.collisionLeftWall){
            player.anims.play('run', true).flipX = true; //on joue l'aniamtion run inversée si l'on se dirige vers la gauche
        }
        player.setVelocityX(-speed_x);
    } else if (keyboard.right.isDown /*&& !player.collisionRightWall*/) {
        if(!player.collisionRightWall){
            player.anims.play('run', true).resetFlip(); //on joue l'aniamtion run non inversée si l'on se dirige vers la droite
        }
        player.setVelocityX(speed_x);
        //player.collisionLeftWall = false;     
    } else{ player.anims.play('idle',true); }


    // Mouvement vertical
    if (keyboard.up.isDown && player.onTheFloor) {
        //keyboard.up.reset();
        player.setVelocityY(-vitesseY);
        player.onTheFloor = false;
        //player.anims.play('jump', true); /*animation de saut pas encore implémentée*/
    }
    //player.onTheFloor = false;
}

