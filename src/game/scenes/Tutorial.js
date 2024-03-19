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

  create() {
    super.create();

    this.progressTracker = new ProgressTracker(0, { x: 300, y: 5900 }, []);
    this.progressData = this.progressTracker.loadProgress();
    const position = this.progressData.spritePosition;

    this.add.image(400, 300, "sky").setScale(20);

    this.player = this.physics.add.sprite(position.x, position.y, "NinjaCat");
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
    const tutorial = this.map.createLayer("tutorial", itemsTileSet, 0, 0);
    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.physics.add.collider(this.player, ground);

    this.physics.add.overlap(this.player, items);
    this.physics.add.overlap(this.player, coins);
    this.physics.add.overlap(this.player, tiles);
    this.physics.add.overlap(this.player, tutorial);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.startFollow(this.player);

    

    tiles.setTileIndexCallback(257, this.triggerWorkbench, this);

    items.setTileIndexCallback(
      [145, 155, 154, 138],
      (sprite, tile) => {
        this.progressTracker.saveProgress(sprite);
      },
      this
    );

    coins.setTileIndexCallback(
      158,
      (sprite = null, tile, layer = coins) => {
        this.progressTracker.collectCoins(sprite, tile, layer);
      },
      this
    );

    this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.text = this.add.text(320, 700, "", {
      fontSize: "20px",
      fill: "ffffff",
    });

    this.scoreText = this.add.text(50, 60, "0", {
      fontSize: "20px",
      fill: "ffffff",
    });

    this.text.setScrollFactor(0);
    this.scoreText.setScrollFactor(0);

    this.progressTracker.removeItems(coins);

    EventBus.emit("current-scene-ready", this);
  }

  update() {

    let score = this.progressTracker.progressData.score;
    this.scoreText.setText(score);

    if (Phaser.Input.Keyboard.JustDown(this.s)) {
      this.progressTracker.resetProgress();
    }

    if (Phaser.Input.Keyboard.JustDown(this.r)) {
      this.scene.restart();
    }

    super.update();
  }
}

