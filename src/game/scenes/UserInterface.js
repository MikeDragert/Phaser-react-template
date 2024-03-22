import { EventBus } from "../EventBus";
import { Scene } from "phaser";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class UserInterface extends Scene {
  constructor() {
    super("UserInterface");
  }

  create() {

    EventBus.on("scoreUpdate", (data) => {
      console.log("DATA: ", data);
      if (data != null) {
        this.scoreText.setText(`${data}`);
      }
      setTimeout(() => {
        this.scoreText.setText("");
      }, 2000);
    });

    let message_count = 0;

    EventBus.on("miscText", (data) => {
     

      if (data && message_count == 0) {
        message_count = 1
        const textBox = createTextBox(
          this,
          280,
          30,
          {
            wrapWidth: 500,
          }
          // data
        ).start(data, 20);
        console.log("MESSAGE COUNT:", message_count);
        setTimeout(() => {
          textBox.destroy();
          message_count = 0;
        }, 4000);
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

    this.scoreText.setScrollFactor(0);
    
  }

  update() {}
}

export function triggerWorkbench(sprite, tile) {
  EventBus.emit("miscText", "Press E to Open Workbench");
  if (this.e.isDown) {
    EventBus.emit("touch-flag", tile);
  }
  setTimeout(() => {
    EventBus.emit("miscText", "");
  }, 2000);
  return false;
}

export function playMessage(sprite, flag) {
  const message = flag.data.list.message[0].value;
  if (message != null) {
    EventBus.emit("miscText", message);
  }

  setTimeout(() => {
    EventBus.emit("miscText", "");
  }, 2000);
  return false;
}



export function createTextBox (scene, x, y, config, miscText) {

  const GetValue = Phaser.Utils.Objects.GetValue;

  const wrapWidth = GetValue(config, "wrapWidth", 0);
  const fixedWidth = GetValue(config, "fixedWidth", 0);
  const fixedHeight = GetValue(config, "fixedHeight", 0);
  const titleText = GetValue(config, "title", undefined);

  let textBox = scene.rexUI.add
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
      // text: scene.add.text(0, 0, `${miscText}`, {
      //   fontSize: "20px",
      //   wordWrap: {
      //     width: wrapWidth,
      //   },
      // }),

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
        let icon = this.getElement("action").setVisible(false);
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

        let icon = this.getElement("action").setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        let tween = scene.tweens.add({
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

const getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.add
    .text(0, 0, "", {
      fontSize: "20px",
      wordWrap: {
        width: wrapWidth,
      },
      maxLines: 3,
    })
    .setFixedSize(fixedWidth, fixedHeight);
};

const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.rexUI.add.BBCodeText(0, 0, "", {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: "20px",
    wrap: {
      mode: "word",
      width: wrapWidth,
    },
    maxLines: 3,
  });
};

