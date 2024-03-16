import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
    this.load.image("star", "star.png");
    this.load.image("sky", "skies/sky.png");
    this.load.atlas(
      "NinjaCat",
      "sprites/JsonArrayCat.png",
      "sprites/JsonArrayCat.json",
      { frameWidth: 20, frameHeight: 48 }
    );
    this.load.image("ground", "ground/spritesheet_ground.png");
    this.load.tilemapTiledJSON("tilemap", "maps/FirstAttempt.json");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
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

    this.scene.start("MainMenu");
  }
}

