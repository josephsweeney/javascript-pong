

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
    this.state = [1.0,1.0,1.0,1.0,1.0,1.0,1.0]
    this.energy = 10
    this.candidate = null
    console.log(game)

    this.loadState()
    // window.onload = this.startGame.bind(this)
    window.onload = this.startLearning.bind(this)
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
    console.log("learning: "+this.k)
    if(!this.playing) {
      this.generateCandidate()
      this.evaluateCandidate()
    }
  }

  playAgain() {
    this.k += 1
    if(this.acceptanceProb() >= Math.random()) {
      this.state = this.candidate
      this.energy = this.nextEnergy
      console.log("accepted candidate, new energy is: "+this.energy)
    }
    if(this.k<this.kmax) {
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
    this.nextEnergy = this.score[1]-this.score[0]
    let p = Math.exp(this.energy-this.nextEnergy)
    console.log("acceptanceProb: "+p+" nextEnergy: "+this.nextEnergy)
    return p
  }

  generateCandidate() {
    let newCoeffs = []
    for(let i = 0; i<this.state.length; i++) {
      let r = Math.random()
      let diff = 0
      if(r<0.05) {
        // Try a big jump
        diff = (Math.random() * 100 ) - 50
      } else {
        // Tweak it
        diff = Math.random() * 2 - 1
      }
      newCoeffs.push(this.state[i]+diff)
    }
    this.candidate = newCoeffs
  }

  startGame() {
    this.playing = true
    this.sendKeyDown("1")
    let fps = 1000
    let intervalTime = 1000.0/fps
    this.intervalID = window.setInterval(this.makeMove.bind(this), intervalTime)
  }

  makeMove() {
    if(this.isTerminal()) {
      window.clearInterval(this.intervalID)
      this.playing = false
      this.playAgain()
    }
    let up = 1, down = 2, stop = 0
    let difference = this.updateScores()
    let dir = this.getMove()
    this.move(dir)
  }

  getMove() {
    let downThreshold = -10
    let upThreshold = 10
    let params = this.getParameters()
    let sum = 0
    for(let i = 0; i<params.length; i++) {
      sum += params[i]*this.candidate[i]
    }
    if(sum < downThreshold) {
      return 2
    } else if (sum > upThreshold) {
      return 1
    } else {
      return 0
    }
  }

  // makeMove() {
  //   if(this.isTerminal())   {
  //     window.clearInterval(this.intervalID)
  //     this.playing = false
  //   }
  //   let paddle = this.game.leftPaddle
  //   let ball = this.game.ball
  //   let up = 1, down = 2, stop = 0
  //   if(paddle.y+(paddle.height/2)<ball.y) {
  //     // move down
  //     this.move(down)
  //   }
  //   else if (paddle.y+(paddle.height/2)>ball.y) {
  //     this.move(up)
  //   }
  // }

  updateScores() {
    let newScores = this.game.scores
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
