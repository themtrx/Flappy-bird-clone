
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config);

const VELOCITY = 200
const flapVelocity = 250
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 } 

let bird = null

let upperPipe = null
let lowerPipe = null

let pipeOpeningRange = [150, 250]
let pipeOpening = Phaser.Math.Between(...pipeOpeningRange)

let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeOpening)

function preload () {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
  this.load.image('pipe', 'assets/pipe.png')
}

function create () {
  const backgroung = this.add.image(0, 0, 'sky')
  backgroung.setOrigin(0)

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0)
  bird.body.gravity.y = 400

  upperPipe = this.physics.add.sprite(400, pipeVerticalPosition, 'pipe').setOrigin(0, 1)
  lowerPipe = this.physics.add.sprite(400, upperPipe.y + pipeOpening, 'pipe').setOrigin(0)

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