import { createGame } from './game.js';
import { createApp, renderBoard, updateGame, createModal, closeModal, showVictory } from './ui.js';
import { saveResult } from './storage.js';
import { formatTime } from './utils.js';

const elements = createApp();
const modal = createModal();
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
    const saved = saveResult(state.moves);
    showVictory(modal, state.moves, formatTime(elapsedSeconds), saved);
  }
});

elements.board.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (card) game.selectCard(Number(card.dataset.id));
});

function handleAction(event) {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'new-game') {
    closeModal(modal);
    game.startGame();
  }
  if (action === 'close-modal') closeModal(modal);
}

elements.app.addEventListener('click', handleAction);
modal.addEventListener('click', handleAction);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal(modal);
});
modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal(modal);
});

game.startGame();
