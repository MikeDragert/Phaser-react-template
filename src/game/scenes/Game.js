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

    //thise next 2 blocks were added for sending keys back to the app.jsx
    //  if there is a better way to watch the phaser input we can adjust these
    //watch for key down and trigger message to app.jsx
    this.input.keyboard.on('keydown', (event) => {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ONE){
       this.sendKeyPressMessage(event.keyCode, true)
      }
    })

    //watch for key up and trigger message to app.jsx
    this.input.keyboard.on('keyup', (event) => {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ONE){
       this.sendKeyPressMessage(event.keyCode, false)
      }
    })

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

