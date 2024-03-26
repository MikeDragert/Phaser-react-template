import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
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
  _PLAYERDEFAULTSCALE = 2;

  fixPlayerOffset = function (currentDirectionLeft) {
    if (this.lastDirectionLeft !== currentDirectionLeft) {
      let offset = currentDirectionLeft
        ? -this._PLAYERWIDTHADJUST
        : this._PLAYERWIDTHADJUST;
      this.cameras.main.startFollow(this.player, false, 1, 1, offset / 2, 0);
      this.player.setPosition(this.player.x + offset, this.player.y);
      this.lastDirectionLeft = currentDirectionLeft;
    }
  };

  inventory = [];

  sendNewItemMessage = function (item) {
    ///.sceneName needs to be set ..is it?
    console.log("ITEM IN PLAYER: ", item);
    EventBus.emit("add-inventory-item", {
      sceneName: this.sceneName,
      item: item,
    });
  };

  //anything that has to be cleared upon returning from the workbench should go here
  clearWorkbenchProperties() {
    this.jumpValues.power = 0;
    this.setPlayerSize(1);
    this.passKey = undefined;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  playerSizeMultiplier = 1;
  lastPlayerSizeMultiplier = this.playerSizeMultiplier;
  passKey = undefined;

  checkPlayerSize() {
    if (this.lastPlayerSizeMultiplier !== this.playerSizeMultiplier) {
      this.player.setScale(
        this._PLAYERDEFAULTSCALE * this.playerSizeMultiplier
      );
      this.lastPlayerSizeMultiplier = this.playerSizeMultiplier;
    }
  }

  lastDirectionLeft = false;
  //*******************************************************/
  //********** start of jumping code **********************/
  //these values can be manipulated to adjust jump behaviour
  jumpConfig = {
    maxJumps: 2,
    baseJumpAmount: 50,
    baseJumpAountIncreasePerAccum: 20,
    jumpPowerMultiplier: 1,
    accumulatorDelay: 0,
    maxAccumulatorCount: 10,
    jumpDelay: 0,
    maxJumpingTimingCount: 20,
  };

  //values used in the jump logic
  jumpValues = {
    count: 0,
    power: 0,
    jumpingTimingCount: -1,
    initialJumpAmount: 0,
    savedJumpAmount: 0,
  };

  airMove = 0;
  
  addToJumpAmount = function (currentAmount) {
    currentAmount +=
      this.jumpConfig.baseJumpAountIncreasePerAccum +
      this.jumpConfig.jumpPowerMultiplier * this.jumpValues.power;
    return currentAmount;
  };

  disableJump = function () {
    this.jumpValues.initialJumpAmount = -1;
  };

  resetForNextJump = function () {
    this.jumpValues.jumpingTimingCount = -1;
    this.jumpValues.initialJumpAmount = 0;
  };

  startJump = function () {
    return (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.jumpValues.initialJumpAmount >= 0 &&
      this.jumpValues.count < this.jumpConfig.maxJumps
    );
  };

  executePlayerJump = function () {
    return this.jumpValues.jumpingTimingCount >= this.jumpConfig.jumpDelay;
  };

  beginJump = function () {
    return this.jumpValues.initialJumpAmount >= 0;
  };

  continueJump = function () {
    return (
      this.jumpValues.jumpingTimingCount < this.jumpConfig.maxJumpingTimingCount
    );
  };

  continueAmountAccumulation = function () {
    return (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.jumpValues.jumpingTimingCount < this.jumpConfig.maxAccumulatorCount
    );
  };

  playerEndedJump = function () {
    return !this.cursors.up.isDown && !this.cursors.space.isDown;
  };

  initialJumpAmountNotSet = function () {
    return this.jumpValues.initialJumpAmount === 0;
  };

  newJump = function () {
    return this.jumpValues.jumpingTimingCount < 0;
  };

  pastAccumulatorDelay = function () {
    return (
      this.jumpValues.jumpingTimingCount > this.jumpConfig.accumulatorDelay
    );
  };

  //*** this is the main jump logic */
  executeJumpLogic = function () {
    let player = this.player;
    if (this.startJump()) {
      this.airMove = 0;
      if (this.initialJumpAmountNotSet()) {
        this.jumpValues.initialJumpAmount = this.jumpConfig.baseJumpAmount;
      }
      if (this.newJump()) {
        this.jumpValues.jumpingTimingCount = 0;
      }
      if (this.pastAccumulatorDelay()) {
        this.jumpValues.initialJumpAmount = this.addToJumpAmount(
          this.jumpValues.initialJumpAmount
        );
      }
    }

    if (!this.newJump() && this.continueJump()) {
      this.jumpValues.jumpingTimingCount++;
    }

    if (this.executePlayerJump()) {
      if (this.beginJump()) {
        this.jumpValues.count++;
        player.anims.play("player-move", true);
        player.anims.msPerFrame = 100;
        this.jumpValues.savedJumpAmount = this.jumpValues.initialJumpAmount;
        player.body.velocity.y = -this.jumpValues.savedJumpAmount;
        this.disableJump();
      }
      if (this.continueJump()) {
        if (this.continueAmountAccumulation()) {
          this.jumpValues.savedJumpAmount = this.addToJumpAmount(
            this.jumpValues.savedJumpAmount
          );
        }
        player.body.velocity.y = -this.jumpValues.savedJumpAmount;
      }
      if (this.playerEndedJump()) {
        this.resetForNextJump();
      }
    }
  };
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
        this.airMove = 0;
        player.body.setVelocityX(-200);
        player.anims.play("player_move", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(false);
      } else {
        if (this.airMove < 12) {
          player.body.velocity.x -= 8;
          this.airMove++;
        }
      }
    } else if (right) {
      if (onFloor) {
        this.airMove = 0;
        player.body.setVelocityX(200);
        player.anims.play("player_move", true);
        player.anims.msPerFrame = 100;
        player.setFlipX(true);
      } else {
        if (this.airMove < 12) {
          player.body.velocity.x += 8;
          this.airMove++;
        }
      }
    } else {
      if (onFloor) {
        this.airMove = 0;
        player.body.setVelocityX(0);
        player.anims.msPerFrame = 500;
      }

      console.log(this.airMove);
    }

    this.executeJumpLogic();

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

  setPlayerSize(newSize) {
    //we want to reduce the effectiveness of the multiplier by 10
    if (newSize > 1) {
      this.playerSizeMultiplier = Math.min(2, 1 + newSize / 100);
    } else if (newSize < 1 && newSize > 0) {
      let inverse = 1 / newSize;
      this.playerSizeMultiplier = Math.max(0.25, 1 - inverse / 100);
    } else {
      this.playerSizeMultiplier = 1;
    }
    this.player.setScale(
      (this._PLAYERDEFAULTSCALE * Math.round(this.playerSizeMultiplier * 100)) /
        100
    );
  }

  setPassKey(newPassKey) {
    this.passKey = newPassKey;
  }

  setInventory(newInventory) {
    this.inventory = newInventory;
  }

  //key events stored for app.jsx to consume
  sendKeyEvents = [];

  ///send keypress to the event bus (for App.jsx)
  // thhis is done using an array for App.jsx to read because
  // even though this gets called once, we end up with two messages on the event bus 🤷‍♂️
  sendKeyPressMessage = function (keyCode, isDown) {
    this.sendKeyEvents.push({ keyCode: keyCode, isDown: isDown });
    EventBus.emit("keyEvent", {
      scene: this,
      keyCode: keyCode,
      isDown: isDown,
    });
  };

  inventory = [];
  sendItemPickup = [];

  sendItemColllectionMessage = function (keyCode, isDown) {
    this.sendKeyEvents.push({ keyCode: keyCode, isDown: isDown });
    EventBus.emit("keyEvent", {
      scene: this,
      keyCode: keyCode,
      isDown: isDown,
    });
  };

  sendNewItemMessage = function (item) {
    const itemWithSceneName = { sceneName: this.sceneName, item: item };
    this.sendItemPickup.push(itemWithSceneName);
    EventBus.emit("add-inventory-item", itemWithSceneName);
  };
}

