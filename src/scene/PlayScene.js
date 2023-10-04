import BaseScene from "./BaseScene"

const PIPE_TO_RENDER = 4

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config)

        this.bird = null
        this.pipes = null

        this.pipeHorizontalDistance = 0
        this.pipeOpeningRange = [150, 250]
        this.pipeHorizontalDistanceRange = [500, 550]
        this.flapVelocity = 300

        this.core = 0
        this.scoreText = ''
    }

    create() {
        super.create()
        this.createBird()
        this.createPipes()
        this.createColliders()
        this.createScore()
        this.createPause()
        this.handleInputs()
        this.listenToEvents()
    }

    update() {
        this.checkGameStatus()
        this.recyclePipes()
    }

    listenToEvents() {
        if(this.pauseEvent) return
        
        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3
            this.countDownText = this.add.text(...this.screenCenter, `Fly in: ${this.initialTime}`, this.fontOptions).setOrigin(0.5)

            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    }

    countDown() {
        this.initialTime--

        this.countDownText.setText(`Fly in: ${this.initialTime}`)

        if(this.initialTime <= 0) {
            this.countDownText.setText('')
            this.physics.resume()
            this.timedEvent.remove()
        }
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0)
        this.bird.body.gravity.y = 600
        this.bird.setCollideWorldBounds(true)
    }

    createPipes(){
        this.pipes = this.physics.add.group()

        for (let i = 0; i < PIPE_TO_RENDER; i++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1)
            const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0)

            this.placePipes(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-200)
    }
    
    handleInputs(){
        this.input.keyboard.on('keydown-SPACE', this.flap, this)
    }

    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
    }

    createScore(){
        this.score = 0
        const bestScore = localStorage.getItem('bestScore')

        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000' })
        this.add.text(16, 52, `Best Score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000' })
    }

    createPause() {
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause').setOrigin(1).setScale(2)
        pauseButton.setInteractive()

        pauseButton.on('pointerdown', () => {
            this.physics.pause()
            this.scene.pause()
            this.scene.launch('PauseScene')
        })
    }

    checkGameStatus(){
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0){
            this.gameOver()
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
              this.increaseScore()
              this.saveBestScore()
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

    saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore') 
        const bestScore = bestScoreText && Number(bestScoreText)

        if(!bestScore || this.score > bestScore){
            localStorage.setItem('bestScore', this.score)
        }
    }

    gameOver(){
        this.physics.pause()
        this.bird.setTint(0xff0000)

        this.saveBestScore()

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart()
            },
            loop: false
        })
    }
        
    flap(){
        this.bird.body.velocity.y = -this.flapVelocity
    }

    increaseScore(){
        this.score++
        this.scoreText.setText(`Score: ${this.score}`)
    }
    
}

export default PlayScene