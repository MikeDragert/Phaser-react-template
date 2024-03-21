import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { triggerWorkbench } from "./UserInterface";
import { ProgressTracker } from "./progressTracker";

export class Game extends Player {
  constructor() {
    super("Game");
    this.sceneName = "Game";
  }

  die() {
    this.scene.restart();
  }

  create() {
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

    this.player = this.physics.add.sprite(position.x, position.y, "NinjaCat").setScale(2).setDepth(1);
    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);
    this.player.setCollideWorldBounds(true);

    this.map = this.make.tilemap({ key: "tilemap" });
    const groundTileSet = this.map.addTilesetImage(
      "spritesheet_ground",
      "ground"
    );
    const itemsTileSet = this.map.addTilesetImage("spritesheet_items", "items");
    const ground = this.map.createLayer("ground", groundTileSet, 0, 0);
    const items = this.map.createLayer("checkpoints", itemsTileSet, 0, 0);
    const coins = this.map.createLayer("coinLayer", itemsTileSet, 0, 0);
    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.physics.add.collider(this.player, ground);

    this.physics.add.overlap(this.player, items);
    this.physics.add.overlap(this.player, coins);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.setZoom(0.5, 0.5)
    this.cameras.main.startFollow(this.player);

    items.setTileIndexCallback(
      [145, 155, 154, 138],
      triggerWorkbench,
      this
    );

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
    let score = this.progressTracker.progressData.score;
    EventBus.emit("scoreUpdate", score)

    if (Phaser.Input.Keyboard.JustDown(this.s)) {
      EventBus.emit('clear-inventory', this.sceneName);
      this.progressTracker.resetProgress();
    }

    if (Phaser.Input.Keyboard.JustDown(this.r)) {
      this.progressTracker.respawn(this);
    }

    if (Phaser.Input.Keyboard.JustDown(this.one)) {
      this.sendKeyPressMessage(Phaser.Input.Keyboard.KeyCodes.ONE, true);
    }

    super.update();
  }

  changeScene() {
    this.scene.start("GameOver");
    this.scene.stop("UserInterface");
  }
}

