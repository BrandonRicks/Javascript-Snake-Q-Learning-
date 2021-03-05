// game settings
const GAMES = 10;
const FIELD_SIZE = 360;
const FIELD_UNIT = 12;
const FRAME_RATE = 18;

// game bottlenecks

// neural network settings
const MUTATION_RATE = 0.5;
const ELITISM = Math.round(0.1 * GAMES);

// score settings
const POINTS_MOVED_TOWARDS_FOOD = 1;
const POINTS_MOVED_AGAINST_FOOD = -1.5;
const POINTS_ATE_FOOD = 2;
const MAX_TURNS = 50000;
const LOWEST_SCORE_ALLOWED = -30;

// neataptic framework call
const Neat = neataptic.Neat;
const Config = neataptic.Config;
Config.warnings = false;

// neat initialization
const neat = new Neat(6, 2, null, {
    popsize: GAMES,
    elitism: ELITISM,
    mutationRate: MUTATION_RATE
  }
);

const chartData = {
  labels: [],
  datasets: [
    {
      name: 'Max',
      values: []
    },
    {
      name: 'Average',
      values: []
    },
    {
      name: 'Min',
      values: []
    }
  ]
};

const chart = new Chart('#chart', {
  title: 'generation score history',
  type: 'line',
  height: 120,
  data: chartData,
  colors: ['red', 'yellow', 'green']

});

let highestScore = 0;

const ai = new Ai({
  neat,
  fields: GAMES,
  fieldSize: FIELD_SIZE,
  fieldUnit:  FIELD_UNIT,
  frameRate: FRAME_RATE,
  maxTurns: MAX_TURNS,
  lowestScoreAllowed: LOWEST_SCORE_ALLOWED,
  score: {
    getCloserToTheFood: POINTS_MOVED_TOWARDS_FOOD,
    getAwayFromFood: POINTS_MOVED_AGAINST_FOOD,
    ateFood: POINTS_ATE_FOOD
  },
  onEndGeneration: ({generation, max, avg, min}) => {
    chartData.labels.push(generation.toString());
    chartData.datasets[0].values.push(max);
    chartData.datasets[1].values.push(avg);
    chartData.datasets[2].values.push(min);

    chart.update(chartData);
    if (max > highestScore) {
      highestScore = max;
    }

    document.getElementById('generation').innerHTML = generation;
    //document.getElementById('highest-score').innerHTML = highestScore
  }
});

ai.launchGeneration();
