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
  jumpPowerIncrease = 0;
  jumpingTimingCount = 0; //track how fare are through the jump process
  initialJumpAmount = 0;
  savedJumpAmount = 0;

   //anything that has to be cleared upon returning from the workbench should go here
   clearWorkbenchProperties() {
    this.jumpPowerIncrease = 0;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    let player = this.player;
    const right = this.cursors.right.isDown;
    const left = this.cursors.left.isDown;
    const onFloor = player.body.onFloor();

    if (onFloor) {
      this.jumpCount = 0;
    }

    if (left) {
      if (onFloor) {
        player.setOffset(133, 20);
        player.body.setVelocityX(-1000);
        player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(true);
      } else {
        player.body.velocity.x -= 10;
      }
    } else if (right) {
      if (onFloor) {
        player.body.setVelocityX(1000);
        player.setOffset(40, 20);
        player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(false);
      } else {
        player.body.velocity.x += 10;
      }
    } else {
      if (onFloor) {
        player.anims.play("player-idle", true);
        player.anims.msPerFrame = 500;
        player.body.setVelocityX(0);
      }
    }

    //jumping logic starts here
    if (this.cursors.up.isDown || this.cursors.space.isDown) {
      if ((this.initialJumpAmount >= 0))  {
        if (this.jumpCount < 2) {
          //this starts tracking for the next jump
          this.initialJumpAmount += 400;
          if (this.jumpingTimingCount < 0) {
            this.jumpingTimingCount = 0;
          }
        }
      }
    } 

    if (this.jumpingTimingCount >= 0) {
      this.jumpingTimingCount++;
    }
    
    //we've waited long enough, start processing the jump
    if (this.jumpingTimingCount >= 10) {
      if (this.initialJumpAmount >= 0) {
        //begin jump  
        this.jumpCount++
        player.anims.play("player-jump", true);
        player.anims.msPerFrame = 30;
        this.savedJumpAmount = -this.initialJumpAmount - (20 * this.jumpPowerIncrease);
        player.body.velocity.y = this.savedJumpAmount;
        //this disables jumping again, until the jump button is release
        this.initialJumpAmount = -1;
      }
      
      //hold up velocity to continue jump until our sequence number hits max
      if (this.jumpingTimingCount < (30)) {
        player.body.velocity.y = this.savedJumpAmount;
      }

      // end jump on jump key release
      if (!this.cursors.up.isDown && !this.cursors.space.isDown) {
        this.jumpingTimingCount = -1;
        this.initialJumpAmount = 0;
      }
    }
    

    player.body.velocity.x = Phaser.Math.Clamp(
      player.body.velocity.x,
      -10000,
      10000
    );

    player.body.velocity.y = Phaser.Math.Clamp(
      player.body.velocity.y,
      -1000,
      2000
    );
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  setJumpPower(newJumpPower) {
    this.jumpPowerIncrease = newJumpPower;
  }

  //key events stored for app.jsx to consume
  sendKeyEvents = [];
      
  ///send keypress to the event bus (for App.jsx)
  // thhis is done using an array for App.jsx to read because
  // even though this gets called once, we end up with two messages on the event bus 🤷‍♂️
  sendKeyPressMessage = function(keyCode, isDown) {
    this.sendKeyEvents.push({keyCode: keyCode, isDown: isDown})
    EventBus.emit('keyEvent', {scene: this, keyCode: keyCode, isDown: isDown});
  }
}
