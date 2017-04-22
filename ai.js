

class AI {
  constructor(game) {
    this.game = game
    this.moving = null
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
    window.setInterval(this.makeMove.bind(this), intervalTime)
  }

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

}
