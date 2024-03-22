import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { playMessage, triggerWorkbench } from "./UserInterface";
import { ProgressTracker } from "./progressTracker";


export class Tutorial extends Player {
  constructor() {
    super("Tutorial");
  }

  changeScene() {
    this.scene.start("Game");
    this.scene.stop("UserInterface");
  }

  restart(data) {
    console.log("IN RESTART", data);
  }

  create() {
    this.died = false;

    super.create();

    this.scene.launch("UserInterface");
    this.progressTracker = new ProgressTracker(
      0,
      { x: 300, y: 5900 },
      [],
      this.sceneName
    );
    this.progressData = this.progressTracker.loadProgress();

    const position = this.progressData.spritePosition;

    this.add.image(400, 300, "sky").setScale(20);

    // create player
    this.player = this.physics.add
      .sprite(position.x, position.y, "NinjaCat")
      .setScale(2)
      .setDepth(1);

    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);

    //this.player.body.setMaxVelocityY(20000);

    this.player.setCollideWorldBounds(true);
    this.player.visible = true;
    this.player.body.moves = true;

    this.map = this.make.tilemap({ key: "tutorial" });
    const groundTileSet = this.map.addTilesetImage(
      "spritesheet_ground",
      "ground"
    );

    // tilesets
    const itemsTileSet = this.map.addTilesetImage("spritesheet_items", "items");
    const tilesTileSet = this.map.addTilesetImage("spritesheet_tiles", "tiles");
    const checkpointsLayer = this.map.addTilesetImage(
      "spritesheet_items_large",
      "checkpoints"
    );
    const largeTilesSet = this.map.addTilesetImage(
      "spritesheet_tiles_large",
      "large_tiles"
    );
    // map layers
    const ground = this.map.createLayer("ground", groundTileSet, 0, 0);
    const checkpoints = this.map.createLayer(
      "checkpoints",
      checkpointsLayer,
      0,
      0
    );
    const coins = this.map.createLayer("coinLayer", itemsTileSet, 0, 0);
    const tiles = this.map.createLayer("tileLayer", largeTilesSet, 0, 0);
    const water = this.map.createLayer("water", tilesTileSet, 0, 0).setDepth(2);
    const tutorialObjects = this.map.getObjectLayer("tutorial")["objects"];

    tutorialObjects.forEach((obj) => {
      const sprite = this.physics.add.sprite(obj.x, obj.y, "tutorial_flag");
      sprite.body.moves = false;
      sprite.setData("message", obj.properties);
      sprite.setOrigin(0, 1);
      this.physics.add.overlap(this.player, sprite, playMessage, null, this);
    });

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    // colliders and overlaps
    this.physics.add.collider(this.player, ground);
    ground.setCollisionByExclusion([-1]);
    this.physics.add.overlap(this.player, checkpoints);
    this.physics.add.overlap(this.player, coins);
    this.physics.add.overlap(this.player, tiles);
    this.physics.add.overlap(this.player, water);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.setZoom(0.5, 0.5);
    this.cameras.main.startFollow(
      this.player,
      false,
      1,
      1,
      this._PLAYERWIDTHADJUST / 2,
      0
    );

    water.setTileIndexCallback([258, 266], this.progressTracker.die, this);

    tiles.setTileIndexCallback(417, triggerWorkbench, this);

    let previousSave = false;

    checkpoints.setTileIndexCallback(
      [250],
      (sprite, tile) => {
        if (!previousSave) {
          this.progressTracker.saveProgress(sprite);
          previousSave = true;
        }

        setTimeout(() => {
          previousSave = false;
        }, 4000);
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

    this.progressTracker.removeItems(coins);

    EventBus.emit("current-scene-ready", this);
    EventBus.emit("give-me-inventory", this.sceneName);
  }

  update() {
    let score = this.progressTracker.progressData.score || 0;
    EventBus.emit("scoreUpdate", score);

    if (Phaser.Input.Keyboard.JustDown(this.s)) {
      EventBus.emit("clear-inventory", this.sceneName);
      this.progressTracker.resetProgress();
    }

    if (Phaser.Input.Keyboard.JustDown(this.r)) {
      this.progressTracker.respawn(this);
    }

    if (Phaser.Input.Keyboard.JustDown(this.one)) {
      this.sendKeyPressMessage(Phaser.Input.Keyboard.KeyCodes.ONE, true);
    }

    // if (Phaser.Input.Keyboard.JustUp(this.one)) {
    //   this.sendKeyPressMessage(Phaser.Input.Keyboard.KeyCodes.ONE, false);
    // }

    super.update();
  }
}

