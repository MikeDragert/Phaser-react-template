import { EventBus } from "../EventBus";
import { Scene } from "phaser";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;



export class UserInterface extends Scene {
  constructor() {
    super("UserInterface");
  }

  content = "";

  create() {

    createTextBox(this, 100, 100, {
      wrapWidth: 500,
    }).start(this.content, 50);

    EventBus.on("scoreUpdate", (data) => {
      if (data) {
        this.content = data
      }
      setTimeout(() => {
        this.scoreText.setText("");
      }, 2000);
    });

    EventBus.on("tutorialMessage", (data) => {
      if (data) {
        this.tutorialText.setText(`${data}`);
      }
      setTimeout(() => {
        this.tutorialText.setText("");
      }, 2000);
    });

    EventBus.on("workbenchText", (data) => {
      if (data) {
        this.text.setText(`${data}`);
      }
      setTimeout(() => {
        this.text.setText("");
      }, 2000);
    });

    EventBus.on("miscText", (data) => {
      if (data) {
        this.miscText.setText(`${data}`);
      }
    });

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
  if (message != null) {
    EventBus.emit("tutorialMessage", message);
  }

  setTimeout(() => {
    EventBus.emit("tutorialMessage", "");
  }, 2000);
  return false;
}

const GetValue = Phaser.Utils.Objects.GetValue;

var createTextBox = function (scene, x, y, config) {
  var wrapWidth = GetValue(config, "wrapWidth", 0);
  var fixedWidth = GetValue(config, "fixedWidth", 0);
  var fixedHeight = GetValue(config, "fixedHeight", 0);
  var titleText = GetValue(config, "title", undefined);

  var textBox = scene.rexUI.add
    .textBox({
      x: x,
      y: y,

      background: scene.rexUI.add.roundRectangle({
        radius: 20,
        color: COLOR_PRIMARY,
        strokeColor: COLOR_LIGHT,
        strokeWidth: 2,
      }),

      icon: scene.rexUI.add.roundRectangle({ radius: 20, color: COLOR_DARK }),

      // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
      text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

      action: scene.add
        .image(0, 0, "nextPage")
        .setTint(COLOR_LIGHT)
        .setVisible(false),

      title: titleText
        ? scene.add.text(0, 0, titleText, { fontSize: "24px" })
        : undefined,

      separator: titleText
        ? scene.rexUI.add.roundRectangle({ height: 3, color: COLOR_DARK })
        : undefined,

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,

        icon: 10,
        text: 10,

        separator: 6,
      },

      align: {
        title: "center",
      },
    })
    .setOrigin(0)
    .layout();

  textBox
    .setInteractive()
    .on(
      "pointerdown",
      function () {
        var icon = this.getElement("action").setVisible(false);
        this.resetChildVisibleState(icon);
        if (this.isTyping) {
          this.stop(true);
        } else if (!this.isLastPage) {
          this.typeNextPage();
        } else {
          // Next actions
        }
      },
      textBox
    )
    .on(
      "pageend",
      function () {
        if (this.isLastPage) {
          return;
        }

        var icon = this.getElement("action").setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        var tween = scene.tweens.add({
          targets: icon,
          y: "+=30", // '+=100'
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0, // -1: infinity
          yoyo: false,
        });
      },
      textBox
    )
    .on("complete", function () {
      console.log("all pages typing complete");
    });
  //.on('type', function () {
  //})

  return textBox;
};

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.add.text(0, 0, '', {
          fontSize: '20px',
          wordWrap: {
              width: wrapWidth
          },
          maxLines: 3
      })
      .setFixedSize(fixedWidth, fixedHeight);
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.rexUI.add.BBCodeText(0, 0, '', {
      fixedWidth: fixedWidth,
      fixedHeight: fixedHeight,

      fontSize: '20px',
      wrap: {
          mode: 'word',
          width: wrapWidth
      },
      maxLines: 3
  })
}

