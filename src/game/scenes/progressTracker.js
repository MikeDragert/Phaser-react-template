import { Scene } from "phaser";

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
    this.progressData.items.push({ idex: item.index, x: item.x, y: item.y });
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
  collectCoins(sprite, tile, layer) {
    layer.removeTileAt(tile.x, tile.y);
    this.updateScore(this.progressData.score + 1);
    this.updateItems(tile);
    return false;
  }

  // resets progress:
  // if (Phaser.Input.Keyboard.JustDown(this.s)) {
  //   this.progressTracker.resetProgress();
  // }
  resetProgress() {
    this.progressData = {
      score: 0,
      spritePosition: { x: 300, y: 5700 },
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
    console.log("--------PROGRESS SAVED----------------");
  }
  // loads progress from local store/db call :
  // this.progressData = this.progressTracker.loadProgress();
  // const position = this.progressData.spritePosition;

  // then get what you want from progressData

  loadProgress() {
    let storedData = JSON.parse(localStorage.getItem(`progress_${this.level}`));
    if (storedData) {
      this.progressData = storedData;
    }
    console.log("Level", this.level);
    console.log("DATTA", this.progressData);
    return this.progressData;
  }

  // removes all items in the item layer from a given layer call like:
  // this.progressTracker.removeItems(coins);
  removeItems(layer) {
    if (this.progressData.items) {
      for (let item of this.progressData.items) {
        layer.removeTileAt(item.x, item.y);
      }
    }
  }
}

