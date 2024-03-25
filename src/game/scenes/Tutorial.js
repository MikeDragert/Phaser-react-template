import { EventBus } from "../EventBus";
import { Player } from "./Player";
import { playMessage, triggerWorkbench } from "./UserInterface";
import { ProgressTracker } from "./progressTracker";

export class Tutorial extends Player {
  constructor() {
    super("Tutorial");
  }

  changeScene() {
    this.scene.start("GameOver");
    this.scene.stop("UserInterface");
  }

  restart(data) {
    console.log("IN RESTART", data);
  }

  create() {
    this.died = false;

    super.create();

    this.progressTracker = new ProgressTracker(
      0,
      { x: 36, y: 828 },
      [],
      this.sceneName
    );
    this.progressData = this.progressTracker.loadProgress();

    const position = this.progressData.spritePosition;

    this.add.image(400, 300, "sky").setScale(20);
    // this._PLAYERDEFAULTSCALE
    // create player
    this.player = this.physics.add
      .sprite(position.x, position.y, "lilGreenGuy")
      .setScale(this._PLAYERDEFAULTSCALE)
      .setDepth(1);

    this.player.setBounce(0.2);
    this.player.body.setSize(15, 18);
    this.player.setOffset(5, 5);

    //this.player.body.setMaxVelocityY(20000);

    this.player.setCollideWorldBounds(true);
    this.player.visible = true;
    this.player.body.moves = true;

    this.map = this.make.tilemap({ key: "newTutorial" });

    // tilesets
    const tilemap_packed = this.map.addTilesetImage(
      "tilemap_packed",
      "tilemap_packed"
    );
    const sand_packed = this.map.addTilesetImage("sand_packed", "sand_packed");
    const stone_packed = this.map.addTilesetImage(
      "stone_packed",
      "stone_packed"
    );

    // map layers
    const floorLayers = [tilemap_packed, sand_packed, stone_packed];
    const ground = this.map.createLayer("ground", tilemap_packed, 0, 0);
    const floor = this.map.createLayer("floor", floorLayers, 0, 0);
    const water = this.map
      .createLayer("water", tilemap_packed, 0, 0)
      .setDepth(2);
    const props = this.map.createLayer("props", tilemap_packed, 0, 0);
    const checkPoints = this.map.createLayer(
      "checkPoints",
      tilemap_packed,
      0,
      0
    );

    const workBench = this.map.createLayer("workBench", tilemap_packed, 0, 0);

    // Render Object Layers:
    const tutorialObjects =
      this.map.getObjectLayer("tutorialMessages")["objects"];

    tutorialObjects.forEach((obj) => {
      const tutorial_plaque = this.physics.add
        .sprite(obj.x, obj.y, "tutorial_plaque")
        .setScale(2);
      tutorial_plaque.body.moves = false;
      tutorial_plaque.setData("message", obj.properties);
      tutorial_plaque.setOrigin(0, 1);
      this.physics.add.overlap(
        this.player,
        tutorial_plaque,
        playMessage,
        null,
        this
      );
    });

    const coinObjects = this.map.getObjectLayer("coinLayer")["objects"];
    let coinIdCounter = 0;

    coinObjects.forEach((obj) => {
      const coinId = `coin-tutorial-${coinIdCounter++}`;

      if (
        this.progressData.items.some((item) => item.uniqueItemName === coinId)
      ) {
        return;
      }

      const coin = this.physics.add
        .sprite(obj.x, obj.y, "spinning_coin")
        .setName(coinId);
      this.physics.add.collider(coin, floor);
      this.physics.add.overlap(this.player, coin, (player, coin) => {
        this.progressTracker.collectCoins(player, coin);
        this.sendNewItemMessage(coin);
      });
      coin.anims.play("spinning_coin", true);
      coin.anims.msPerFrame = 70;
    });

    //Physical bounds and coliders:
    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.physics.add.collider(this.player, floor);
    floor.setCollisionByExclusion([-1]);
    this.physics.add.overlap(this.player, checkPoints);
    this.physics.add.overlap(this.player, water);
    this.physics.add.overlap(this.player, workBench);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.setZoom(1.5, 1.5);
    this.cameras.main.startFollow(
      this.player,
      false,
      1,
      1,
      this._PLAYERWIDTHADJUST / 2,
      0
    );

    water.setTileIndexCallback(
      [54, 74],
      (sprite, tile) => {
        this.progressTracker.die(sprite);
      },
      this
    );

    workBench.setTileIndexCallback(27, triggerWorkbench, this);

    let previousSave = false;

    checkPoints.setTileIndexCallback(
      [112, 132],
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

    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    EventBus.emit("current-scene-ready", this);
    EventBus.emit("give-me-inventory", this.sceneName);

    this.scene.launch("UserInterface");
  }

  update() {
    this.checkPlayerSize();

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

