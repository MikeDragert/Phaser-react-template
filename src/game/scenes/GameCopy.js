import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  #player = Phaser.Physics.Arcade.Sprite;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  jumpCount = 0;
  jumpPower = 0;
  create() {
    this.add.image(400, 300, "sky").setScale(20);

    const map = this.make.tilemap({ key: "tilemap" });
    const groundTileSet = map.addTilesetImage("spritesheet_ground", "ground");
    const ground = map.createLayer("ground", groundTileSet, 0, 0);
    ground.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    this.player = this.physics.add.sprite(120, 980, "NinjaCat");
    this.player.setBounce(0.2);
    this.player.body.setSize(80, 190);
    this.player.setOffset(40, 20);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, ground.width, ground.height);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "player-walk",
      framreate: 30,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 8,
        prefix: "NinjaCat_walk_0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "player-idle",
      framreate: 10,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 2,
        prefix: "NinjaCat_idle_0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "player-jump",
      framrate: 30,
      frames: this.anims.generateFrameNames("NinjaCat", {
        start: 1,
        end: 6,
        prefix: "NinjaCat_jump_0",
        suffix: ".png",
      }),
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    let player = this.player;
    const upJustReleased = Phaser.Input.Keyboard.JustUp(this.cursors.up);
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
    const right = this.cursors.right.isDown;
    const left = this.cursors.left.isDown;
    const onFloor = player.body.onFloor();

    if (onFloor) {
      this.jumpCount = 0;
    }

    if (left) {
      if (onFloor) {
        player.setOffset(133, 20);
        player.body.setVelocityX(-500);
        player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(true);
      } else {
        player.setFlipX(true);
        player.setOffset(133, 20);
        player.body.velocity.x -= 10;
      }
    } else if (right) {
      if (onFloor) {
        player.body.setVelocityX(500);
        player.setOffset(40, 20);
        player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(false);
      } else {
        player.setFlipX(false);
        player.setOffset(40, 20);
        player.body.velocity.x += 10;
      }
    } else {
      if (onFloor) {
        player.anims.play("player-idle", true);
        player.anims.msPerFrame = 500;
        player.body.setVelocityX(0);
      }
    }

    if (this.cursors.up.isDown && this.jumpCount <= 2 && this.jumpPower < 600) {
      this.jumpPower += 50;
      console.log("HERERER");
      console.log(this.jumpCount);
      if (upJustPressed) {
        this.jumpCount++
      }
    }

    if (upJustReleased && this.jumpCount < 2) {
      let jumpVelocity = this.jumpPower + 200
      player.body.setVelocityY(-jumpVelocity); // Apply vertical velocity to jump
      player.anims.play("player-jump", true);
      player.anims.msPerFrame = 30;
      this.jumpPower = 0;
      console.log("Heree");
      console.log(this.jumpCount);
    }

    // Cap the player's horizontal velocity to avoid unrealistic speeds
    player.body.velocity.x = Phaser.Math.Clamp(
      player.body.velocity.x,
      -500,
      500
    );
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}