

class AI {
  constructor(game) {
    this.game = game
    this.moving = null
    this.possibleMoves = [0,1,2]
    this.score = [0,0]
    this.playing = false
    this.k = 0
    this.kmax = 1000
    this.nextEnergy = null
    this.state =[3,-12,0,0,0,4,13]
    this.energy = -300
    this.candidate = null
    this.learning = false
    this.opponentScored = false
    console.log(game)

    this.loadState()
    window.onload = this.startGame.bind(this)
    //window.onload = this.startLearning.bind(this)
  }

  loadState() {
    if(localStorage.getItem("pongAI")) {
      let json = JSON.parse(localStorage.getItem("pongAI"))
      this.energy = json.energy
      this.state = json.state
    }
  }

  saveState() {
    let store = {
      energy: this.energy,
      state: this.state
    }
    localStorage.setItem("pongAI", JSON.stringify(store))
  }

  dumpState() {
    let store = {
      energy: this.energy,
      state: this.state
    }
    localStorage.setItem("tmppongAI", JSON.stringify(store))
  }

  sendKeyDown(key) {
    let keycode = key.charCodeAt(0);
    this.game.onkeydown(keycode)
  }

  sendKeyUp(key) {
    let keycode = key.charCodeAt(0);
    this.game.onkeyup(keycode)
  }

  startLearning() {
    this.learning = true
    console.log("learning: "+this.k)
    this.generateCandidate()
    if(!this.playing) {
      this.evaluateCandidate()
    }
  }

  playAgain() {
    if(this.k<this.kmax) {
      this.k += 1
      if(this.acceptanceProb() >= Math.random()) {
        this.state = this.candidate
        this.energy = this.nextEnergy
        console.log("accepted candidate, new energy is: "+this.energy)
      }
      if(this.playing) {
        this.paddleHits = 0
      }
      this.dumpState()
      this.startLearning()
    } else {
      this.saveState()
    }
  }

  evaluateCandidate() {
    this.startGame()
  }

  acceptanceProb() {
    let opponentScorePenalty = this.opponentScored ? 1 : 0
    let scoreBonus = this.playerScored ? -100 : 0
    this.nextEnergy = this.paddleHits === 0
      ? 10
      : -this.paddleHits + opponentScorePenalty
    let p = Math.exp((this.energy-this.nextEnergy))/2
    console.log("acceptanceProb: "+p+" nextEnergy: "+this.nextEnergy)
    return p
  }

  generateCandidate() {
    let newCoeffs = []
    for(let i = 0; i<this.state.length; i++) {
      let r = Math.random()
      let diff = 0
      if(r<0.333) {
        diff = 1.0
      } else if(r<0.666) {
        diff = -1.0
      }
      // diff *= Math.random()*2
      newCoeffs.push(this.state[i]+diff)

    }
    this.candidate = newCoeffs
  }

  startGame() {
    this.playing = true
    this.sendKeyDown("1")
    let fps = 60
    let intervalTime = 1000.0/fps
    this.paddleHits = 0
    this.lastDirection = 0
    this.opponentScored = false
    this.playerScored = false
    this.intervalID = window.setInterval(this.makeMove.bind(this), intervalTime)
  }

  makeMove() {
    if(this.isTerminal() && this.learning) {
      window.clearInterval(this.intervalID)
      this.playing = false
      this.playAgain()
    }
    let up = 1, down = 2, stop = 0
    let difference = this.updateScores()
    if((difference[0] !== 0 || difference[1] !== 0) && this.learning) {
      this.opponentScored = difference[1] !== 0
      this.playerScored = difference[0] !== 0
      this.playAgain()
    }
    let dir = this.getMove()
    this.move(dir)
    this.checkForHit()
  }

  getMove() {
    let downThreshold = -100
    let upThreshold = 100
    let params = this.getParameters()
    let sum = 0
    let coeffs = this.learning ? this.candidate : this.state
    for(let i = 0; i<params.length; i++) {
      sum += params[i]*coeffs[i]
    }
    if(sum < downThreshold) {
      return 2
    } else if (sum > upThreshold) {
      return 1
    } else {
      return 0
    }
  }

  checkForHit() {
    let ball = this.game.ball
    let direction = ball.dx < 0 ? -1 : 1
    if(this.lastDirection === -1 && direction === 1) {
      this.paddleHits += 1
    }
    this.lastDirection = direction
  }

  updateScores() {
    let newScores = [this.game.scores[0],this.game.scores[1]]
    let difference = [newScores[0]-this.score[0],newScores[1]-this.score[1]]
    if(difference[0] !== 0 || difference[1] !== 0) {

      this.score = newScores
    }
    return difference
  }

  getParameters() {
    let ball = this.game.ball
    let paddle = this.game.leftPaddle
    return [ball.x, ball.y, ball.dx, ball.dy, ball.accel, paddle.x, paddle.y]
  }


  isTerminal() {
    let scores = this.game.scores
    return scores[0]===9 || scores[1]===9
  }

  /* Movement code */

  moveUp() {
    this.moving = 1
    if (!this.game.leftPaddle.auto)  this.game.leftPaddle.moveUp()
  }

  stopMovingUp() {
    this.moving = null
    if (!this.game.leftPaddle.auto)  this.game.leftPaddle.stopMovingUp();
  }

  moveDown() {
    this.moving = 2
    if (!this.game.leftPaddle.auto)  this.game.leftPaddle.moveDown()
  }

  stopMovingDown() {
    this.moving = null
    if (!this.game.leftPaddle.auto)  this.game.leftPaddle.stopMovingDown();
  }

  move(direction) {
    let stop = 0
    let up = 1
    let down = 2
    if(direction === up) {
      if(this.moving === down){
        this.stopMovingDown()
      }
      if (this.moving !== up) {
        this.moveUp()
      }
    } else if (direction === down) {
      if(this.moving === up){
        this.stopMovingUp()
      }
      if (this.moving !== down) {
        this.moveDown()
      }
    } else if (direction === stop) {
      this.moving === up ? this.stopMovingUp() :
      this.moving === down ? this.stopMovingDown() : null
    }
  }
}
