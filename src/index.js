
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
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 } 

let bird = null

function create () {
  const backgroung = this.add.image(0, 0, 'sky')
  backgroung.setOrigin(0)

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0)

  this.input.keyboard.on('keydown-SPACE', flap);
}

function update (time, delta) {
  if(bird.y > config.height || bird.y < -bird.height){
    restartPlayerPosition()
  }
}

function restartPlayerPosition(){
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
  bird.body.velocity.y = 0
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}