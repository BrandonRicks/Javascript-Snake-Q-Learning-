class Snake {

  // basic constructor
  constructor (score) {
    this.scoreModifiers = score;
  }

  // intialize the snake with 3 blocks
  // the initial direction is right
  // the snake didn't eat the food at the start
  reset () {
    // initialize the snake
    this.tail = [
      [21, 21],
      [22, 21],
      [23, 21],
      [24, 21],
      [25, 21]
    ];
    // snake starts by moving to the right
    this.direction = 'right';
    this.isEating = false;
  }

  // set the snake in motion
  move (field) {
    let canMoveForward = 0;
    let canMoveLeft = 0;
    let canMoveRight = 0;
    let isFoodForward = 0;
    let isFoodLeft = 0;
    let isFoodRight = 0;

    // head is basically the first block of the snake
    let head = this.tail[this.tail.length - 1];

    // evaluate the environment
    // can the snake go straight ahead
    // can the snake turn right
    // can the snake turn left
    // is the food straight ahead
    // is the food on the left
    // is the food on the right
    // this.direction can be right →, down ↓, left ←, up ↑
    switch (this.direction) {
      // check if 
      // - the head touch the wall or his tail
      // - the food is on the right, in the front, on the left
      case 'up':
        if (head[1] !== 1)                canMoveForward  = 1;
        if (head[0] !== 1)                canMoveLeft     = 1;
        if (head[0] !== field.unitsPerRow) canMoveRight   = 1;

        if (field.food.position[1] < head[1]) isFoodForward = 1;
        if (field.food.position[0] < head[0]) isFoodLeft    = 1;
        if (field.food.position[0] > head[0]) isFoodRight   = 1;

        this.tail.forEach(block => {
          if (head[0]     === block[0] && head[1] - 1 === block[1]) canMoveForward = 0;
          if (head[0] - 1 === block[0] && head[1]     === block[1]) canMoveLeft    = 0;
          if (head[0] + 1 === block[0] && head[1]     === block[1]) canMoveRight   = 0;
        });

        break

      case 'down':
        if (head[1] !== field.unitsPerRow) canMoveForward = 1;
        if (head[0] !== field.unitsPerRow) canMoveLeft    = 1;
        if (head[0] !== 1)                canMoveRight = 1;

        if (field.food.position[1] > head[1]) isFoodForward = 1;
        if (field.food.position[0] < head[0]) isFoodRight = 1;
        if (field.food.position[0] > head[0]) isFoodLeft = 1;

        this.tail.forEach(block => {
          if (head[0]     === block[0] && head[1] + 1 === block[1]) canMoveForward = 0;
          if (head[0] + 1 === block[0] && head[1]     === block[1]) canMoveLeft = 0;
          if (head[0] - 1 === block[0] && head[1]     === block[1]) canMoveRight = 0;
        });

        break

      case 'left':
        if (head[0] !== 1)                canMoveForward = 1;
        if (head[1] !== field.unitsPerRow) canMoveLeft   = 1;
        if (head[1] !== 1)                canMoveRight   = 1;

        if (field.food.position[0] < head[0]) isFoodForward = 1;
        if (field.food.position[1] < head[1]) isFoodRight   = 1;
        if (field.food.position[1] > head[1]) isFoodLeft    = 1;

        this.tail.forEach(block => {
          if (head[1]     === block[1] && head[0] - 1 === block[0]) canMoveForward = 0;
          if (head[1] + 1 === block[1] && head[0]     === block[0]) canMoveLeft    = 0;
          if (head[1] - 1 === block[1] && head[0]     === block[0]) canMoveRight   = 0;
        });

        break

      case 'right':
        if (head[0] !== field.unitsPerRow) canMoveForward = 1;
        if (head[1] !== 1)                canMoveLeft    = 1;
        if (head[1] !== field.unitsPerRow) canMoveRight   = 1;

        if (field.food.position[0] > head[0]) isFoodForward = 1;
        if (field.food.position[1] < head[1]) isFoodLeft    = 1;
        if (field.food.position[1] > head[1]) isFoodRight   = 1;

        this.tail.forEach(block => {
          if (head[1]     === block[1] && head[0] + 1 === block[0]) canMoveForward = 0;
          if (head[1] - 1 === block[1] && head[0]     === block[0]) canMoveLeft    = 0;
          if (head[1] + 1 === block[1] && head[0]     === block[0]) canMoveRight   = 0;
        });

        break
    }

    // activate the neural network
    const input = [canMoveForward, canMoveLeft, canMoveRight, isFoodForward, isFoodLeft, isFoodRight];
    // retrieve the output of our neural network
    // we only have number between 0 and 1 so we'll aproximate them to 0 (no) or 1 (yes)
    // after the aproximation we'll only have one 1
    const output = this.brain.activate(input).map(_output => Math.round(_output));

    // set the new direction by checking which one of the output is a yes
    // turn left
    if (output[0]) { 
      this.brain.score += isFoodLeft ? this.scoreModifiers.getCloserToTheFood : this.scoreModifiers.getAwayFromFood;

      switch (this.direction) {
        case 'up':    this.direction = 'left';  break
        case 'down':  this.direction = 'right'; break
        case 'left':  this.direction = 'down';  break
        case 'right': this.direction = 'up';    break
      }
    }
    // turn right
    else if (output[1]) { 
      this.brain.score += isFoodRight ? this.scoreModifiers.getCloserToTheFood : this.scoreModifiers.getAwayFromFood;

      switch (this.direction) {
        case 'up':    this.direction = 'right'; break
        case 'down':  this.direction = 'left';  break
        case 'left':  this.direction = 'up';    break
        case 'right': this.direction = 'down';  break
      }
    }
    // go forward
    else { 
      this.brain.score += isFoodForward ? this.scoreModifiers.getCloserToTheFood : this.scoreModifiers.getAwayFromFood;
    }

    // move the snake
    
    if (this.isEating) {
      switch (this.direction) {
        case 'up':    this.tail.push([head[0], head[1] - 1]); break
        case 'down':  this.tail.push([head[0], head[1] + 1]); break
        case 'left':  this.tail.push([head[0] - 1, head[1]]); break
        case 'right': this.tail.push([head[0] + 1, head[1]]); break
      }

      this.isEating = false;
    } else {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i][0] = this.tail[i + 1][0];
        this.tail[i][1] = this.tail[i + 1][1];
      }

      head = this.tail[this.tail.length - 1];

      switch (this.direction) {
        case 'up':
          head[0] = this.tail[this.tail.length - 2][0];
          head[1] = this.tail[this.tail.length - 2][1] - 1;
          break
        case 'down':
          head[0] = this.tail[this.tail.length - 2][0];
          head[1] = this.tail[this.tail.length - 2][1] + 1;
          break
        case 'left':
          head[0] = this.tail[this.tail.length - 2][0] - 1;
          head[1] = this.tail[this.tail.length - 2][1];
          break
        case 'right':
          head[0] = this.tail[this.tail.length - 2][0] + 1;
          head[1] = this.tail[this.tail.length - 2][1];
          break
      }
    }

    head = this.tail[this.tail.length - 1];

    if (field.food.position[0] === head[0] && field.food.position[1] === head[1]) {
      this.isEating = true;
      this.brain.score += this.scoreModifiers.ateFood;
    }
  }

  draw(p, field) {
    p.fill('green');
    field.snake.tail.forEach(block => {
      p.rect(
        block[0] * field.unit - field.unit,
        block[1] * field.unit - field.unit,
        field.unit,
        field.unit
      );
    });
  }

};
