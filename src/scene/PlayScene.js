import Phaser from 'phaser'

const PIPE_TO_RENDER = 4

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene')
        this.config = config

        this.bird = null
        this.pipes = null

        this.pipeHorizontalDistance = 0
        this.pipeOpeningRange = [150, 250]
        this.pipeHorizontalDistanceRange = [500, 550]
        this.flapVelocity = 250
    }

    preload() {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('bird', 'assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
    }

    create() {
        this.createBG()
        this.createBird()
        this.createPipes()
        this.handleInputs()
    }

    update() {
        this.checkGameStatus()
        this.recyclePipes()
    }

    createBG(){
        this.add.image(0, 0, 'sky').setOrigin(0)
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0)
        this.bird.body.gravity.y = 400
    }

    createPipes(){
        this.pipes = this.physics.add.group()

        for (let i = 0; i < PIPE_TO_RENDER; i++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1)
            const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0)

            this.placePipes(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-200)
    }
    
    handleInputs(){
        this.input.keyboard.on('keydown-SPACE', this.flap, this)
    }

    checkGameStatus(){
        if(this.bird.y > this.config.height || this.bird.y < -this.bird.height){
            this.restartPlayerPosition()
        }
    }

    placePipes(upPipe, lowPipe){
        const rightMostX = this.getRightMostPipe()
        const pipeOpening = Phaser.Math.Between(...this.pipeOpeningRange)
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeOpening)
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange)
      
        upPipe.x = rightMostX + pipeHorizontalDistance
        upPipe.y = pipeVerticalPosition

        lowPipe.x = upPipe.x
        lowPipe.y = upPipe.y + pipeOpening
    }
      
    recyclePipes(){
        const tempPipes = []
      
        this.pipes.getChildren().forEach(pipe => {
          if(pipe.getBounds().right < 0){
            tempPipes.push(pipe)
      
            if(tempPipes.length == 2){
              this.placePipes(...tempPipes)
            }
          }
        })
    }

    getRightMostPipe(){
        let rightMostX = 0
        
        this.pipes.getChildren().forEach(pipe => {
            rightMostX = Math.max(pipe.x, rightMostX)
        })
        
        return rightMostX
    }

    restartPlayerPosition(){
        this.bird.x = this.config.startPosition.x
        this.bird.y = this.config.startPosition.y
        this.bird.body.velocity.y = 0
    }
        
    flap(){
        this.bird.body.velocity.y = -this.flapVelocity
    }
    
}

export default PlayScene