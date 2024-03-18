import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Player extends Scene {
  constructor(sceneName) {
    super(sceneName);
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  jumpCount = 0;
  jumpPower = 0;

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    let player = this.player;
    const upJustReleased = Phaser.Input.Keyboard.JustUp(this.cursors.up);
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
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

    if (this.cursors.up.isDown) {
      if (this.cursors.up.isDown && this.jumpCount < 20 && this.jumpPower === 0) {
        this.jumpCount++
        player.anims.play("player-jump", true);
        player.anims.msPerFrame = 30;
        this.jumpPower = 1;
        player.body.velocity.y = -400;
      } else if (this.jumpPower > 0 && this.jumpPower < 20) {
        
        this.jumpPower++;
        player.body.velocity.y = -400 - this.jumpPower * 2;
      }
    } else {
      
      this.jumpPower = 0;
    }

    player.body.velocity.x = Phaser.Math.Clamp(
      player.body.velocity.x,
      -500,
      500
    );

    player.body.velocity.y = Phaser.Math.Clamp(
      player.body.velocity.y,
      -1000,
      3000
    );
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
