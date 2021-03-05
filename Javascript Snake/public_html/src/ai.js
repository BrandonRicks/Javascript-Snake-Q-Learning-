 class Ai {

  constructor ({neat, fields, fieldSize, fieldUnit, frameRate, maxTurns, lowestScoreAllowed, score, onEndGeneration}) {
    this.neat = neat;
    this.fields = [];
    this.fieldsFinished = 0;
    this.onEndGeneration = onEndGeneration;

    for (let i = 0; i < fields; i++) {
      this.fields.push(new Field({
        size: fieldSize,
        unit: fieldUnit,
        frameRate,
        maxTurns,
        lowestScoreAllowed,
        score,
        onGameOver: () => this.endGeneration()
      }));
    }
  }

  launchGeneration () {
    this.fieldsFinished = 0;

    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].snake.brain = this.neat.population[i];
      this.fields[i].snake.brain.score = 0;
      this.fields[i].start();
    }
  }

  endGeneration () {
    if (this.fieldsFinished + 1 < this.fields.length) {
      this.fieldsFinished++;
      return;
    }

    this.neat.sort();

    this.onEndGeneration({
      generation: this.neat.generation,
      max: this.neat.getFittest().score,
      avg: Math.round(this.neat.getAverage()),
      min: this.neat.population[this.neat.popsize - 1].score
    });

    const newGeneration = [];

    for (let i = 0; i < this.neat.elitism; i++) {
      newGeneration.push(this.neat.population[i]);
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring());
    }

    this.neat.population = newGeneration;
    this.neat.mutate();
    this.neat.generation++;
    this.launchGeneration();
  }

};

