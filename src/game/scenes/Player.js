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
      if (this.cursors.up.isDown && this.jumpCount <= 2 && this.jumpPower === 0) {
        
        player.anims.play("player-jump", true);
        player.anims.msPerFrame = 30;
        this.jumpPower = 1;
        player.body.velocity.y = -400;
      } else if (this.jumpPower > 0 && this.jumpPower < 31) {
        
        this.jumpPower++;
        player.body.velocity.y = -400 + this.jumpPower * 7;
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
      1000
    );
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  setJumpPower(newJumpPower) {
    //todo:  this needs to be updated to change the actual character jump power that the game uses!!
    //recommending a x10 on this, so that lower numbers like 1 to 10 are more noticable when used...eg jumpPower(9) becomes jumpPower(90) behind the scenes??
    console.log('set jump power', newJumpPower * 10)
    let jumpPower= newJumpPower * 10;
  }

  //key events stored for app.jsx to consume
  sendKeyEvents = [];
  //track state changes on keypress for toggleKey method
  keyToggles = {};

    //can be used to track if key state has changed (up vs down) and only return true if it has changed
    toggleKey = function(keyCode, isDown) {
      if ((this.keyToggles[keyCode] === undefined) ||
          (this.keyToggles[keyCode] !== isDown)) {
          this.keyToggles[keyCode] = isDown;
          return true; 
        }
        return false;
      }
    
  //this logs the keypress in an scene array, and then sends an event
  // to the react side of things to notify it that there is a key press to handle
  //app.jsx will see the keyEvent and check the contents of sendKeyEvents array
  sendKeyPressMessage = function(keyCode, isDown) {
    if (this.toggleKey(keyCode, isDown)) {
      this.sendKeyEvents.push({keyCode: keyCode, isDown: isDown})
      EventBus.emit('keyEvent', this);
    }
  }

}
