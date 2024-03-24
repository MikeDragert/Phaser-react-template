import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Player extends Scene {
  constructor(sceneName) {
    super(sceneName);
    this.sceneName = sceneName; 
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  _PLAYERWIDTHADJUST = 120;



  fixPlayerOffset = function(currentDirectionLeft) {
    if (this.lastDirectionLeft !== currentDirectionLeft) {
      let offset = currentDirectionLeft ?  -this._PLAYERWIDTHADJUST : this._PLAYERWIDTHADJUST;
      this.cameras.main.startFollow(this.player, false, 1, 1, offset/2,0);
      this.player.setPosition(this.player.x + offset, this.player.y)
      this.lastDirectionLeft = currentDirectionLeft;
    }
  }


  inventory = [];

  sendNewItemMessage = function(item) {
    ///.sceneName needs to be set ..is it?
    EventBus.emit('add-inventory-item', {sceneName: this.sceneName, ...item });
  }

  //anything that has to be cleared upon returning from the workbench should go here
  clearWorkbenchProperties() {
    this.power = 0;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  lastDirectionLeft = false
  //*******************************************************/
  //********** start of jumping code **********************/
  //these values can be manipulated to adjust jump behaviour
  jumpConfig = {
    maxJumps: 2,
    baseJumpAmount: 50,
    baseJumpAountIncreasePerAccum: 50,
    jumpPowerMultiplier: 5,
    accumulatorDelay: 6,
    maxAccumulatorCount: 20,
    jumpDelay: 10,
    maxJumpingTimingCount: 50
  }

  //values used in the jump logic
  jumpValues = {
    count: 0,
    power: 0,
    jumpingTimingCount: -1,
    initialJumpAmount: 0,
    savedJumpAmount: 0,
  }
  
  addToJumpAmount = function(currentAmount) {
    currentAmount += this.jumpConfig.baseJumpAountIncreasePerAccum + this.jumpConfig.jumpPowerMultiplier * this.jumpValues.power;
    return currentAmount;
  }

  disableJump = function() {
    this.jumpValues.initialJumpAmount = -1;
  }

  resetForNextJump = function() {
    this.jumpValues.jumpingTimingCount = -1;
    this.jumpValues.initialJumpAmount = 0;
  }

  startJump = function() {
    return (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      (this.jumpValues.initialJumpAmount >= 0) &&
      (this.jumpValues.count < this.jumpConfig.maxJumps)
    );
  };

  executePlayerJump = function() {
    return (this.jumpValues.jumpingTimingCount >= this.jumpConfig.jumpDelay);
  }

  beginJump = function() {
    return (this.jumpValues.initialJumpAmount >= 0);
  }

  continueJump = function() {
    return (this.jumpValues.jumpingTimingCount < this.jumpConfig.maxJumpingTimingCount);
  }
     
  continueAmountAccumulation = function() {
    return (
      (this.cursors.up.isDown || this.cursors.space.isDown) && 
      (this.jumpValues.jumpingTimingCount < this.jumpConfig.maxAccumulatorCount));
  }

  playerEndedJump = function() {
    return (!this.cursors.up.isDown && !this.cursors.space.isDown);
  }  

  initialJumpAmountNotSet = function() {
    return (this.jumpValues.initialJumpAmount === 0);
  }

  newJump = function() {
    return this.jumpValues.jumpingTimingCount < 0;
  }

  pastAccumulatorDelay = function() {
    return (this.jumpValues.jumpingTimingCount > this.jumpConfig.accumulatorDelay);
  }

  //*** this is the main jump logic */
  executeJumpLogic = function() {
    let player = this.player;
    if (this.startJump()) {
      if (this.initialJumpAmountNotSet()) {
        this.jumpValues.initialJumpAmount = this.jumpConfig.baseJumpAmount;
      }
      if (this.newJump()) {
        this.jumpValues.jumpingTimingCount = 0;
      }
      if (this.pastAccumulatorDelay()) {
        this.jumpValues.initialJumpAmount = this.addToJumpAmount(this.jumpValues.initialJumpAmount);
      }
    } 

    if ((!this.newJump()) && (this.continueJump())) {
      this.jumpValues.jumpingTimingCount++;
    }

    if (this.executePlayerJump()) {
      if (this.beginJump()) {
        this.jumpValues.count++
        // player.anims.play("player-jump", true);
        player.anims.msPerFrame = 30;
        this.jumpValues.savedJumpAmount = this.jumpValues.initialJumpAmount;
        player.body.velocity.y = -this.jumpValues.savedJumpAmount;
        this.disableJump();
      }
      if (this.continueJump()) {
        if (this.continueAmountAccumulation()) {
          this.jumpValues.savedJumpAmount = this.addToJumpAmount(this.jumpValues.savedJumpAmount);
        }
        player.body.velocity.y = -this.jumpValues.savedJumpAmount;
      }
      if (this.playerEndedJump()) {
        this.resetForNextJump()
      }
    }
  }
  //************ end of jumping code **********************/
  //*******************************************************/

  update() {
    let player = this.player;
    const right = this.cursors.right.isDown;
    const left = this.cursors.left.isDown;
    const onFloor = player.body.onFloor();

    if (onFloor) {
      this.jumpValues.count = 0;
    }

    if (left) {
      
      if (onFloor) {
        // player.setOffset(133, 20);
        player.body.setVelocityX(-200);
        // player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(false);
        // this.fixPlayerOffset(true);
      } else {
        player.body.velocity.x -= 10;
      }
    } else if (right) {
      if (onFloor) {
        player.body.setVelocityX(200);
        // player.setOffset(40, 20);
        // player.anims.play("player-walk", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(true);
        // this.fixPlayerOffset(false);
      } else {
        player.body.velocity.x += 10;
      }
    } else {
      if (onFloor) {
        // player.anims.play("player-idle", true);
        player.anims.msPerFrame = 500;
        player.body.setVelocityX(0);
      }
    }

    this.executeJumpLogic()
    
    player.body.velocity.x = Phaser.Math.Clamp(
      player.body.velocity.x,
      -10000,
      10000
    );

    player.body.velocity.y = Phaser.Math.Clamp(
      player.body.velocity.y,
      -1800,
      1800
    );
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  setJumpPower(newJumpPower) {
    this.jumpValues.power = newJumpPower;
  }

  setInventory(newInventory) {
    this.inventory = newInventory;
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
