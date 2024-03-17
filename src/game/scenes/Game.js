import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Player } from "./Player";

export class Game extends Player {
  constructor() {
    super("Game");
  }
  collectCoins(sprite, tile) {
    console.log("COINS");
    console.log(tile);
  }
  triggerCheckpoint(sprite, tile) {
    this.text.setText("Press E to open inventory");
    console.log("HERE");
    if (this.e.isDown) {
      EventBus.emit("touch-flag", tile);
    }
    setTimeout(() => {
      this.text.setText("");
    }, 2000);
    return false;
  }

  create() {
    this.isPaused = false;

    EventBus.on("unPause", () => {
      this.isPaused = false;
      console.log(this.isPaused);
    });

    super.create();

    this.add.image(400, 300, "sky").setScale(20);

    this.player = this.physics.add.sprite(300, 100, "NinjaCat");
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

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.startFollow(this.player);

    items.setTileIndexCallback(
      [145, 155, 154, 138],
      this.triggerCheckpoint,
      this
    );

    coins.setTileIndexCallback([158], this.collectCoins, this);

    this.physics.add.overlap(this.player, items);

    this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.text = this.add.text(320, 700, "", {
      fontSize: "20px",
      fill: "ffffff",
    });

    this.text.setScrollFactor(0);

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    super.update();
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

