import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Tutorial } from "./scenes/Tutorial";
import { ProgressTracker } from "./scenes/progressTracker";
import { UserInterface } from "./scenes/UserInterface";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [Boot, Preloader, MainMenu, Game, GameOver, Tutorial, ProgressTracker, UserInterface],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
      debug: true,
      overlapBias: 8,
      tileBias: 32,
      fps: 60,
      fixedStep: true,
    },
  },
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
    }]
  }
};


const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent: parent });
};

export default StartGame;

