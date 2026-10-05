import { shuffle } from './utils.js';

const images = ['happy', 'sad', 'birthday', 'worried', 'amazing', 'pumpkin', 'snow', 'laugh'];

export function createGame(onChange) {
  const state = {
    cards: [],
    firstCard: null,
    secondCard: null,
    moves: 0,
    matchedPairs: 0,
    isLocked: false,
    timeoutId: null,
  };

  function resetSelection() {
    state.firstCard = null;
    state.secondCard = null;
    state.isLocked = false;
  }

  function resetGame() {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
    state.moves = 0;
    state.matchedPairs = 0;
    resetSelection();
  }

  function startGame() {
    resetGame();
    state.cards = shuffle([...images, ...images]).map((image, id) => ({
      id,
      image,
      isOpen: false,
      isMatched: false,
    }));
    onChange(state, 'start');
  }

  function checkPair() {
    const { firstCard, secondCard } = state;

    if (firstCard.image === secondCard.image) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      state.matchedPairs += 1;
      resetSelection();
      onChange(state, state.matchedPairs === images.length ? 'win' : 'match');
      return;
    }

    state.isLocked = true;
    onChange(state, 'mismatch');
    state.timeoutId = setTimeout(() => {
      firstCard.isOpen = false;
      secondCard.isOpen = false;
      state.timeoutId = null;
      resetSelection();
      onChange(state, 'close');
    }, 1000);
  }

  function selectCard(id) {
    const card = state.cards[id];
    if (!card || state.isLocked || card.isOpen || card.isMatched) return;

    card.isOpen = true;

    if (!state.firstCard) {
      state.firstCard = card;
      onChange(state, 'select');
      return;
    }

    state.secondCard = card;
    state.moves += 1;
    checkPair();
  }

  return { startGame, selectCard };
}
