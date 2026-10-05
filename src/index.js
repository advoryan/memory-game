import { createGame } from './game.js';
import { createApp, renderBoard, updateGame } from './ui.js';
import { formatTime } from './utils.js';

const elements = createApp();
let startedAt = null;
let timerId = null;
let elapsedSeconds = 0;

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function updateTimer() {
  elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  elements.counters.time.textContent = formatTime(elapsedSeconds);
}

const game = createGame((state, event) => {
  if (event === 'start') {
    stopTimer();
    startedAt = null;
    elapsedSeconds = 0;
    elements.counters.time.textContent = '00:00';
    renderBoard(elements.board, state.cards);
  }

  if (event === 'select' && startedAt === null) {
    startedAt = Date.now();
    timerId = setInterval(updateTimer, 1000);
  }

  updateGame(elements, state);

  if (event === 'win') {
    updateTimer();
    stopTimer();
  }
});

elements.board.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (card) game.selectCard(Number(card.dataset.id));
});

elements.app.addEventListener('click', (event) => {
  if (event.target.closest('[data-action]')?.dataset.action === 'new-game') game.startGame();
});

game.startGame();
