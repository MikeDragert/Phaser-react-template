import { EventBus } from "../EventBus";

export class ProgressTracker {
  constructor(score, spritePosition, items, level) {
    // super({ key: "ProgressTracker" });
    // default data, set in creating a new tracker:
    // this.progressTracker = new ProgressTracker(0, { x: 300, y: 5900 }, []);
    this.level = level;

    this.progressData = {
      score: score,
      spritePosition: spritePosition,
      items: items,
    };
  }
  
  died = false;
  // updates score
  updateScore(score) {
    this.progressData.score = score;
    console.log("IN TRACKER Score", this.progressData.score);
  }

  // updates position of sprite
  updatePosition(sprite) {
    let position = { x: sprite.x, y: sprite.y };
    this.progressData.spritePosition = position;
    console.log("IN TRACKER Position", this.progressData.spritePosition);
    return false;
  }

  // adds items to item array
  updateItems(item) {
    this.progressData.items.push(item.name);
    console.log("IN TRACKER Items", this.progressData.items);
    return false;
  }

  // call in scene like so:
  // coins.setTileIndexCallback(
  //   158,
  //   (sprite = null, tile, layer = coins) => {
  //     this.progressTracker.collectCoins(sprite, tile, layer);
  //   },
  //   this
  // );
  collectCoins(player, coin) {
    coin.destroy()
    console.log("COIN", coin);
    console.log("COIN DATA:", coin.getData("id"));
    this.updateScore(this.progressData.score + 1);
    this.updateItems(coin);
    this.saveProgress(null);
    return false;
  }

  // resets progress:
  // if (Phaser.Input.Keyboard.JustDown(this.s)) {
  //   this.progressTracker.resetProgress();
  // }
  resetProgress() {
    this.progressData = {
      score: 0,
      spritePosition: { x: 36, y: 828 },
      items: [],
    };
    this.saveProgress();
    console.log("-----RESET TRACKER-------");
  }

  // call in scene examp:
  // items.setTileIndexCallback(
  //   [145, 155, 154, 138],
  //   (sprite, tile) => {
  //     this.progressTracker.saveProgress(sprite);
  //   },
  //   this
  // );
  saveProgress(sprite) {
    if (sprite) {
      this.updatePosition(sprite);
    }

    localStorage.setItem(
      `progress_${this.level}`,
      JSON.stringify(this.progressData)
    );
  }
  // loads progress from local store/db call :
  // this.progressData = this.progressTracker.loadProgress();
  // const position = this.progressData.spritePosition;

  // then get what you want from progressData

  loadProgress() {
    let storedData =
      JSON.parse(localStorage.getItem(`progress_${this.level}`)) ||
      this.progressData;
    if (storedData) {
      this.progressData = storedData;
    }
    return this.progressData;
  }

  die() {
    // this.scene.restart();
    if (!this.died) {
      this.died = true;

      setTimeout(() => {
        this.player.visible = false;
        this.player.body.moves = false;
        EventBus.emit(
          "miscText",
          "You Died Press R To Restart from Checkpoint"
        );
      }, 500);
    }
  }

  respawn(level) {
    level.scene.restart();
    level.player.visible = true;
    level.player.body.moves = true;
  }
}

