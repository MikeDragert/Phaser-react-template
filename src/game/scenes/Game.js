import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Player } from "./Player";

export class Game extends Player {
  constructor() {
    super("Game");
  }

  create() {
    super.create();

    this.add.image(400, 300, "sky").setScale(20);

    this.player = this.physics.add.sprite(120, 980, "NinjaCat");
    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);
    this.player.setCollideWorldBounds(true);

    const map = this.make.tilemap({ key: "tilemap" });
    const groundTileSet = map.addTilesetImage("spritesheet_ground", "ground");
    const ground = map.createLayer("ground", groundTileSet, 0, 0);
    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.startFollow(this.player);

   

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

