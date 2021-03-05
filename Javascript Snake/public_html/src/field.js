class Field {

  constructor ({size, unit, frameRate, maxTurns, lowestScoreAllowed, score, onGameOver}) {
    this.size = size;
    this.unit = unit;
    this.unitsPerRow = this.size / this.unit;
    this.frameRate = frameRate;
    this.maxTurns = maxTurns;
    this.lowestScoreAllowed = lowestScoreAllowed;
    this.onGameOver = onGameOver;
    this.status = 'IDLE';
    this.grid = [];
    this.snake = new Snake(score);
    this.turns = 0;

    for (let x = 0; x < this.unitsPerRow; x++) {
      for (let y = 0; y < this.unitsPerRow; y++) {
        this.grid.push([x + 1, y + 1]);
      }
    }
    
    const field = this;

    new p5(p => {
      p.setup = () => {
        p.frameRate(field.frameRate);
        p.createCanvas(field.size, field.size);
      };


      p.draw = () => {
        if (['IDLE', 'GAME_OVER'].indexOf(field.status) !== -1) {
          p.background('#363636');
          p.fill(0);
          p.textSize(15);
          p.text(field.snake.brain.score.toString(), 40, 47);
          return;
        }

        p.background(180);
        field.snake.move(field);

        if (field.snake.isEating) {
          field.food = new Food(field);
        }

        field.updateGameStatus();

        if (field.status === 'GAME_OVER') {
          return field.onGameOver();
        }

        field.snake.draw(p, field);
        field.food.draw(p, field);

        field.turns++;
      };
    }, 'fieldsWrapper');
  }

  updateGameStatus () {
    const snakeHeadIndex = this.snake.tail.length - 1;
    const snakeHead = this.snake.tail[snakeHeadIndex];
    const snakeHitWall = snakeHead[0] < 1 || snakeHead[0] > this.unitsPerRow || snakeHead[1] < 1 || snakeHead[1] > this.unitsPerRow;
    const snakeHitTail = this.snake.tail.some((s, i) => s[0] === snakeHead[0] && s[1] === snakeHead[1] && i !== snakeHeadIndex);
    const noMoreRoomLeft = this.getfreePositions().length === 1;
    const gameLastedLongEnough = this.turns > this.maxTurns;
    const scoreTooLow = this.snake.brain.score <= this.lowestScoreAllowed;

    if (snakeHitWall || snakeHitTail || noMoreRoomLeft || gameLastedLongEnough || scoreTooLow) {
      this.status = 'GAME_OVER';
    }
  }

  getfreePositions () {
    return this.grid.filter(position => {
      return !this.snake.tail.some(segment => {
        return position[0] === segment[0] && position[1] === segment[1];
      });
    });
  }

  start () {
    this.turns = 0;
    this.snake.reset();
    this.food = new Food(this);
    this.status = 'RUNNING';
  }
};