
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
}

const VELOCITY = 200
const flapVelocity = 250

let bird = null

function create () {
  const backgroung = this.add.image(0, 0, 'sky')
  backgroung.setOrigin(0)

  bird = this.physics.add.sprite(config.width * 0.1 , config.height * 0.5, 'bird').setOrigin(0)

  this.input.keyboard.on('keydown-SPACE', flap);
}


function update (time, delta) {
  if(bird.y > config.height){
    console.log('game over height')
  }else if(bird.y < 0){
    console.log('game over dropped')
  }
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}