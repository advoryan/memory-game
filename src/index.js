import { createGame } from './game.js';
import { createApp, renderBoard, updateGame, createModal, closeModal, showVictory, openModal, renderLeaderboard } from './ui.js';
import { saveResult, loadResults } from './storage.js';

const elements = createApp();
const modal = createModal();
const game = createGame((state, event) => {
  if (event === 'start') {
    renderBoard(elements.board, state.cards);
  }

  updateGame(elements, state);

  if (event === 'win') {
    const saved = saveResult(state.moves);
    showVictory(modal, state.moves, saved);
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
  if (action === 'leaderboard') {
    openModal(modal, 'Leaderboard', renderLeaderboard(loadResults()));
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
