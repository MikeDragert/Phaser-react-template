import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  playerStats = {
    jumpPower: 500,
    speed: 4
  };


  create() {
    const map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64 });
    const tileset = map.addTilesetImage('spritesheet_ground', 'ground');
    this.layer = map.createLayer("GroundLayer", tileset, 0, -1792);
    
    this.player = this.physics.add.sprite(200, 400, 'player').setScale(5);
    this.player.body.setSize(14,18)
    this.player.body.setOffset(22,16)
    this.layer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.layer);

    this.cameras.main.setZoom(.4, .4);
    this.cameras.main.startFollow(this.player, false, 1, 1, 0, 700);

    //debug - show layer collision map
    // let graphics = this.add.graphics()
    // this.layer.renderDebug(graphics, {
    //     tileColor: new Phaser.Display.Color(0, 0, 255, 50), // Non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(0, 255, 0, 100), // Colliding tiles
    //     faceColor: new Phaser.Display.Color(255, 0, 0, 100) // Colliding face edges
    // });

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    this.seven = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
    this.eight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);

    EventBus.emit('current-scene-ready', this);
  }

  update(now, delta) {
    if (this.player.body.blocked.down) {
      this.player.setVelocityX(0);
    }

    if ((this.left.isDown) && (this.player.body.blocked.down)) {
      this.player.x -= this.playerStats.speed;
    } else if ((this.right.isDown)  && (this.player.body.blocked.down))  {
      this.player.x += this.playerStats.speed;
    }

    if ((this.spacebar.isDown) && (this.player.body.blocked.down)) {
      this.player.setVelocityY(-this.playerStats.jumpPower);
      if (this.left.isDown) {
        this.player.setVelocityX(-this.playerStats.speed*100)
      } else if (this.right.isDown) {
        this.player.setVelocityX(this.playerStats.speed*100)
      }      
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
