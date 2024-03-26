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
    // Images
    this.load.image("Labber_Logo", "Labber_Logo.png" )
    this.load.image("logo", "logo.png");
    this.load.image("sky", "skies/sky.png");
    this.load.image("tutorial_plaque", "items/tile_0086.png");
    this.load.image("tilemap_packed", "tiles/tilemap_packed.png");
    this.load.image("sand_packed", "tiles/sand_packed.png");
    this.load.image("stone_packed", "tiles/stone_packed.png");
    this.load.image("iconSpriteSheet", "items/iconSpriteSheet.png");
    this.load.image(
      "tilemap_characters_packed",
      "sprites/tilemap-characters_packed.png"
    );
    this.load.image(
      "nextPage",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png"
    );

    // Sprite Atlas'
    this.load.atlas(
      "spinning_coin",
      "sprites/spinning_coin.png",
      "sprites/spinning_coin.json"
    );
    this.load.atlas(
      "lilGreenGuy",
      "sprites/lilGreenGuy.png",
      "sprites/lilGreenGuy.json",
      { frameWidth: 24, frameHeight: 24 }
    );

    this.load.tilemapTiledJSON("tilemap", "maps/FirstAttempt.json");
    this.load.tilemapTiledJSON("newTutorial", "maps/newTutorial.json");
    // this.load.tilemapTiledJSON("tutorial", "maps/tutorial.json");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.anims.create({
      key: "player_move",
      framreate: 30,
      frames: this.anims.generateFrameNames("lilGreenGuy", {
        start: 0,
        end: 1,
        prefix: "tile_000",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "spinning_coin",
      framreate: 30,
      frames: this.anims.generateFrameNames("spinning_coin", {
        start: 1,
        end: 2,
        prefix: "tile_015",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.scene.start("MainMenu");
  }
}

