import { EventBus } from "../EventBus";
import { Scene } from "phaser";
// import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components.js";

export class UserInterface extends Scene {
  constructor() {
    super("UserInterface");
  }

  create() {
    EventBus.on("scoreUpdate", (data) => {
      if (data) {
        this.scoreText.setText(`${data}`);
      }
    });

    EventBus.on("tutorialMessage", (data) => {
      if (data) {
        this.tutorialText.setText(`${data}`);
      }
    });

    EventBus.on("workbenchText", (data) => {
      if (data) {
        this.text.setText(`${data}`);
      }
    });

    EventBus.on("miscText", (data) => {
      if (data) {
        this.miscText.setText(`${data}`);
      }
    });

    // this.textBox = new TextBox(this);
    // this.add.existing(textBox);

    this.scoreText = this.add.text(30, 30, "0", {
      fontFamily: "Quicksand",
      fontSize: "48px",
      color: "#F8E71C",
      fontStyle: "normal",
      stroke: "#000000",
      strokeThickness: 12,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#FF0000",
        fill: true,
        blur: 2,
        stroke: true,
      },
      padding: { left: null },
    });

    this.tutorialText = this.add.text(30, 120, "", {
      fontFamily: "Quicksand",
      fontSize: "20px",
      color: "#000000",
      stroke: "#534848",
      strokeThickness: 1,
    });

    this.text = this.add.text(320, 700, "", {
      fontFamily: "Quicksand",
      fontSize: "20px",
      color: "#000000",
      stroke: "#534848",
      strokeThickness: 1,
    });

    this.miscText = this.add.text(300, 400, "", {
      fontFamily: "Quicksand",
      fontSize: "20px",
      color: "#000000",
      stroke: "#534848",
      strokeThickness: 1,
    });

    this.text.setScrollFactor(0);
    this.scoreText.setScrollFactor(0);
    this.tutorialText.setScrollFactor(0);
  }
}

export function triggerWorkbench(sprite, tile) {
  EventBus.emit("workbenchText", "Press E to Open Workbench");
  if (this.e.isDown) {
    // this.changeScene()
    EventBus.emit("touch-flag", tile);
  }
  setTimeout(() => {
    EventBus.emit("workbenchText", "");
  }, 2000);
  return false;
}

export function playMessage(sprite, flag) {
  const message = flag.data.list.message[0].value;
  if (message) {
    EventBus.emit("tutorialMessage", message);
  }

  setTimeout(() => {
    EventBus.emit("tutorialMessage", "");
  }, 2000);
  return false;
}

