import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
      const map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64});
      const tileset = map.addTilesetImage('spritesheet_ground','ground');
      this.layer = map.createLayer("GroundLayer", tileset, 0,-1792);
           
      this.player = this.physics.add.sprite(200,400,'player').setScale(5);
      this.player.setCollideWorldBounds(true)
      this.layer.setCollisionByExclusion([-1]);
      this.physics.add.collider(this.player, this.layer)

      this.cameras.main.setZoom(.4,.4);
      this.cameras.main.startFollow(this.player,false, 1, 1, 0, 700)

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
    
    
      if (this.left.isDown) {
        this.player.x -= playerSpeed
      } else if (this.right.isDown) {
        this.player.x += playerSpeed
      }
  
      if ((this.spacebar.isDown) && (this.player.body.touching.down)) {
        // this.player.setVelocityY(-200);
        //workBench.execute1(this.player);
        player.setVelocityY(-200)
  
  
      }
  
      if (this.one.isDown) {
        console.log('one')
      }
  
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
