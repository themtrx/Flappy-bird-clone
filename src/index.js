
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
const PIPE_TO_RENDER = 4

let bird = null
let pipes = null

let pipeHorizontalDistance = 0
const pipeOpeningRange = [150, 250]
const pipeHorizontalDistanceRange = [500, 550]

const flapVelocity = 250
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 } 

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

  pipes = this.physics.add.group()

  for (let i = 0; i < PIPE_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1)
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0)

    placePipes(upperPipe, lowerPipe)
  }

  this.input.keyboard.on('keydown-SPACE', flap);
}

function update (time, delta) {
  if(bird.y > config.height || bird.y < -bird.height){
    restartPlayerPosition()
  }

  recyclePipes()
}

function restartPlayerPosition(){
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
  bird.body.velocity.y = 0
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}

function placePipes(upPipe, lowPipe){
  const rightMostX = getRightMostPipe()
  const pipeOpening = Phaser.Math.Between(...pipeOpeningRange)
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeOpening)
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange)

  upPipe.x = rightMostX + pipeHorizontalDistance
  upPipe.y = pipeVerticalPosition

  lowPipe.x = upPipe.x
  lowPipe.y = upPipe.y + pipeOpening

  upPipe.body.velocity.x = -200
  lowPipe.body.velocity.x = -200
}

function recyclePipes(){
  const tempPipes = []

  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right < 0){
      tempPipes.push(pipe)

      if(tempPipes.length == 2){
        placePipes(...tempPipes)
      }
    }
  })
}

function getRightMostPipe(){
  let rightMostX = 0

  pipes.getChildren().forEach(pipe => {
    rightMostX = Math.max(pipe.x, rightMostX)
  })

  return rightMostX
}
