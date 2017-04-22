

class AI {
  constructor(game) {
    this.game = game
    this.moving = null
    this.possibleMoves = [0,1,2]
    this.setUpLearning()
    console.log(game)
    window.onload = this.startGame.bind(this)
  }

  getBallCoordinates() {
    let ball = this.game.ball
    return {x:ball.x, y:ball.y}
  }

  sendKeyDown(key) {
    let keycode = key.charCodeAt(0);
    this.game.onkeydown(keycode)
  }

  sendKeyUp(key) {
    let keycode = key.charCodeAt(0);
    this.game.onkeyup(keycode)
  }

  startGame() {
    this.sendKeyDown("1")
    let fps = 60
    let intervalTime = 1000.0/60
    this.intervalID = window.setInterval(this.makeMove.bind(this), intervalTime)
  }

  // makeMove() {
  //   let difference = this.updateScores()
  //   let reward = this.getReward(difference)
  //   let dir = this.getMove()
  //   let up = 1, down = 2, stop = 0
  //   this.move(dir)
  // }

  makeMove() {
    let paddle = this.game.leftPaddle
    let ball = this.game.ball
    let up = 1, down = 2, stop = 0
    if(paddle.y+(paddle.height/2)<ball.y) {
      // move down
      this.move(down)
    }
    else if (paddle.y+(paddle.height/2)>ball.y) {
      this.move(up)
    }
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

  /* Reinforcement learning code */

  setUpLearning() {
    this.score = [0,0]
    this.Q = {}
    this.N = {}
    this.lastState = [1,2,2]
    this.lastAction = null
    this.lastReward = null
  }

  updateScores() {
    let newScores = this.game.scores
    let difference = [newScores[0]-this.score[0],newScores[1]-this.score[1]]
    if(difference[0] !== 0 || difference[1] !== 0) {
      this.scores = newScores
    }
    return difference
  }

  getState() {
    let ball = this.game.ball
    let paddle = this.game.leftPaddle
    return [ball.x, ball.y, ball.dx, ball.dy, ball.accel, paddle.x, paddle.y]
  }

  getReward(difference) {
    return difference[0]+(-1*difference[1])
  }

  isTerminal() {
    if(this.game.menu.winner === undefined) {
      return false
    }
    else {
      return true
    }
  }

  getQ(s, a) {
    let key = s.toString+","+a
    let val = this.Q[key]
    if(val !== undefined) {
      return val
    } else {
      return 0
    }
  }

  setQ(s,a, val) {
    let key = s.toString+","+a
    this.Q[key] = val
  }

  getN(s,a) {
    let key = s.toString+","+a
    let val = this.N[key]
    if(val !== undefined) {
      return val
    } else {
      return 0
    }
  }

  incN(s,a) {
    let key = s.toString+","+a
    let val = this.N[key]
    if(val !== undefined) {
      this.N[key] = 1
    } else {
      this.N[key] += 1
    }
  }

  updateQ(s,a){
    return 0
  }

  getMaxAction(lastState, lastAction, lastReward, state) {
    return 0
  }

  // This is an implementation of a basic Q-Learning Agent
  getMove(reward) {
    let state = this.getState()
    if(this.isTerminal()) {
      this.setQ(this.lastState,this.lastAction,reward)
      window.clearInterval(this.intervalID)
    }
    if(this.previousState !== null){
      this.incN(this.lastState,this.lastAction)
      this.updateQ(this.lastState,this.lastAction)
    }
    this.lastState = state
    this.lastAction = this.getMaxAction()
    this.lastReward = reward
    return 0
  }

}
