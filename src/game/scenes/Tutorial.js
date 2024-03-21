import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { ProgressTracker } from "./progressTracker";

export class Tutorial extends Player {
  constructor() {
    super("Tutorial");
  }

  
  changeScene() {
    this.scene.start("Game");
  }

  triggerWorkbench(sprite, tile) {
    this.text.setText("Press E to open inventory");
    console.log("HERE");
    if (this.e.isDown) {
      // this.changeScene()
      EventBus.emit("touch-flag", tile);
    }
    setTimeout(() => {
      this.text.setText("");
    }, 2000);
    return false;
  }

  playMessage(sprite, flag) {
    const message = flag.data.list.message[0].value
    this.tutorialText.setText(`${message}`)
    setTimeout(() => {
      this.tutorialText.setText("");
    }, 2000);
    return false;
  }

  die() {
    this.scene.restart();
  }
  
  create() {
    super.create();

    this.progressTracker = new ProgressTracker(0, { x: 300, y: 5900 }, [], this.sceneName);
    this.progressData = this.progressTracker.loadProgress();
    const position = this.progressData.spritePosition;

    this.add.image(400, 300, "sky").setScale(20);

    this.player = this.physics.add.sprite(position.x, position.y, "NinjaCat").setScale(2);
    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);
    
    this.player.setCollideWorldBounds(true);

    this.map = this.make.tilemap({ key: "tutorial" });
    const groundTileSet = this.map.addTilesetImage(
      "spritesheet_ground",
      "ground"
    );
    const itemsTileSet = this.map.addTilesetImage("spritesheet_items", "items");
    const tilesTileSet = this.map.addTilesetImage("spritesheet_tiles", "tiles");
    const ground = this.map.createLayer("ground", groundTileSet, 0, 0);
    const items = this.map.createLayer("checkpoints", itemsTileSet, 0, 0);
    const coins = this.map.createLayer("coinLayer", itemsTileSet, 0, 0);
    const tiles = this.map.createLayer("tileLayer", tilesTileSet, 0, 0);
    const tutorialObjects = this.map.getObjectLayer("tutorial")["objects"]
    tutorialObjects.pop();
    
    
    tutorialObjects.forEach(obj => {
      const sprite = this.physics.add.sprite(obj.x, obj.y, "tutorial_flag");
      sprite.body.moves =false
      sprite.setData("message", obj.properties)
      sprite.setOrigin(0,1)
      this.physics.add.overlap(this.player, sprite, this.playMessage, null, this)
    })
    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.physics.add.collider(this.player, ground);

    this.physics.add.overlap(this.player, items);
    this.physics.add.overlap(this.player, coins);
    this.physics.add.overlap(this.player, tiles);
    

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.setZoom(0.5, 0.5)
    this.cameras.main.startFollow(this.player, false, 1, 1, this._PLAYERWIDTHADJUST/2,0);

    
    tiles.setTileIndexCallback([226,234], this.die, this)

    tiles.setTileIndexCallback(257, this.triggerWorkbench, this);
    let previousSave = false;

    items.setTileIndexCallback(
      [145, 155, 154, 138],
      (sprite, tile) => {
        if(!previousSave) {
          this.progressTracker.saveProgress(sprite);
          previousSave = true
        }

        setTimeout(() => {
          previousSave = false;
        }, 2000)
      },
      this
    );

    coins.setTileIndexCallback(
      158,
      (sprite = null, tile, layer = coins) => {
        this.progressTracker.collectCoins(sprite, tile, layer);
        this.sendNewItemMessage(tile);
      },
      this
    );

    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.text = this.add.text(320, 700, "", {
			fontFamily: 'Quicksand',
			fontSize: '20px',
			color: '#000000',
			stroke: '#534848',
			strokeThickness: 1
		});

    this.scoreText = this.add.text(50, 60, "0", {
			fontFamily: 'Quicksand',
			fontSize: '48px',
			color: '#F8E71C',
			fontStyle: 'normal',
      stroke: '#000000',
			strokeThickness: 12,
			shadow: { offsetX: 2, offsetY: 2, color: '#FF0000', fill: true, blur: 2, stroke: true },
			padding: { left: null }
		});

    this.tutorialText = this.add.text(50, 120, "", {
			fontFamily: 'Quicksand',
			fontSize: '20px',
			color: '#000000',
			stroke: '#534848',
			strokeThickness: 1
		})

    this.text.setScrollFactor(0);
    this.scoreText.setScrollFactor(0);
    this.tutorialText.setScrollFactor(0);
    this.progressTracker.removeItems(coins);
    
    EventBus.emit("current-scene-ready", this);
    EventBus.emit('give-me-inventory', this.sceneName);
  }

  update() {

    let score = this.progressTracker.progressData.score;
    this.scoreText.setText(score);

    if (Phaser.Input.Keyboard.JustDown(this.s)) {
      this.progressTracker.resetProgress();
    }

    if (Phaser.Input.Keyboard.JustDown(this.r)) {
      EventBus.emit('clear-inventory', this.sceneName);
      this.scene.restart();
    }

    if (Phaser.Input.Keyboard.JustDown(this.one)) {
      this.sendKeyPressMessage(Phaser.Input.Keyboard.KeyCodes.ONE, true)
    }

    // if (Phaser.Input.Keyboard.JustUp(this.one)) {
    //   this.sendKeyPressMessage(Phaser.Input.Keyboard.KeyCodes.ONE, false);
    // }

    super.update();
  }
}

