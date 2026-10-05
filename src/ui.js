import { formatDate } from './utils.js';

export function createElement(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createButton(text, action, className = 'button') {
  const button = createElement('button', className, text);
  button.type = 'button';
  button.dataset.action = action;
  return button;
}

export function createApp() {
  const app = createElement('div', 'app');
  const header = createElement('header', 'header');
  const brand = createElement('div', 'brand');
  brand.append(createElement('h1', 'title', 'Memory'), createElement('p', 'edition', 'Pepe edition'));
  const navigation = createElement('nav', 'navigation');
  navigation.setAttribute('aria-label', 'Game controls');
  navigation.append(
    createButton('New game', 'new-game', 'button button-primary'),
    createButton('Leaderboard', 'leaderboard'),
  );
  header.append(brand, navigation);

  const main = createElement('main', 'main');
  const stats = createElement('dl', 'stats');
  stats.setAttribute('aria-label', 'Game statistics');
  const counters = {};
  for (const [name, value] of [['Moves', '0'], ['Pairs', '0/8']]) {
    const stat = createElement('div', 'stat');
    const counter = createElement('dd', '', value);
    stat.append(createElement('dt', '', name), counter);
    stats.append(stat);
    counters[name.toLowerCase()] = counter;
  }
  const board = createElement('div', 'board');
  board.setAttribute('aria-label', 'Sixteen cards, eight matching pairs');
  const hint = createElement('p', 'board-hint', 'Find all eight pairs in as few moves as possible.');
  hint.setAttribute('role', 'status');
  main.append(stats, board, hint);
  app.append(header, main);
  document.body.append(app);
  return { app, board, hint, counters };
}

export function renderBoard(board, cards) {
  board.replaceChildren(...cards.map(createCard));
}

function createCard(card) {
  const button = createElement('button', 'card');
  button.type = 'button';
  button.dataset.id = card.id;
  button.setAttribute('aria-label', `Card ${card.id + 1}, face down`);
  button.setAttribute('aria-pressed', 'false');
  const back = createElement('span', 'card-back');
  back.setAttribute('aria-hidden', 'true');
  const front = createElement('span', `card-front card-front--${card.image}`);
  front.setAttribute('aria-hidden', 'true');
  const image = createElement('img');
  image.src = `./assets/images/pepe-${card.image}.png`;
  image.alt = '';
  image.draggable = false;
  front.append(image);
  button.append(back, front);
  return button;
}

export function updateGame(elements, state) {
  for (const card of state.cards) {
    const button = elements.board.children[card.id];
    button.classList.toggle('is-open', card.isOpen);
    button.classList.toggle('is-matched', card.isMatched);
    button.setAttribute('aria-pressed', String(card.isOpen));
    button.setAttribute('aria-disabled', String(card.isOpen || state.isLocked));
    const faceName = { snow: 'spy', birthday: 'dancing' }[card.image] ?? card.image;
    const label = card.isOpen ? `${faceName} Pepe${card.isMatched ? ', matched' : ''}` : 'face down';
    button.setAttribute('aria-label', `Card ${card.id + 1}, ${label}`);
  }
  elements.counters.moves.textContent = state.moves;
  elements.counters.pairs.textContent = `${state.matchedPairs}/8`;
  elements.hint.textContent = state.matchedPairs === 8
    ? 'All eight pairs found!'
    : state.isLocked ? 'No match. Remember these cards.' : 'Find all eight pairs in as few moves as possible.';
}

export function createModal() {
  const dialog = createElement('dialog', 'modal');
  dialog.setAttribute('aria-labelledby', 'modal-title');
  const panel = createElement('div', 'modal-panel');
  dialog.append(panel);
  document.body.append(dialog);
  return dialog;
}

export function openModal(dialog, title, content, actions = []) {
  const heading = createElement('h2', 'modal-title', title);
  heading.id = 'modal-title';
  const controls = createElement('div', 'modal-actions');
  controls.append(...actions, createButton('Close', 'close-modal'));
  dialog.firstElementChild.replaceChildren(heading, content, controls);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}

export function closeModal(dialog) {
  dialog.close();
  document.body.classList.remove('modal-open');
}

export function showVictory(dialog, moves, saved) {
  const content = createElement('div', 'victory');
  content.append(
    createElement('p', 'modal-copy', 'You found all eight pairs!'),
    createElement('p', 'victory-score', `${moves} moves`),
  );
  if (!saved) content.append(createElement('p', 'modal-copy', 'Browser storage is unavailable. Your result is kept for this session.'));
  openModal(dialog, 'You won!', content, [createButton('New game', 'new-game', 'button button-primary')]);
}

export function renderLeaderboard(results) {
  if (!results.length) return createElement('p', 'empty-results', 'No results yet. Finish a game to save your score.');
  const table = createElement('table', 'leaderboard');
  const caption = createElement('caption', 'visually-hidden', 'Best games, ranked by moves. Earlier games win ties.');
  const head = createElement('thead');
  const header = createElement('tr');
  for (const title of ['Rank', 'Moves', 'Date']) {
    const cell = createElement('th', '', title);
    cell.scope = 'col';
    header.append(cell);
  }
  head.append(header);
  const body = createElement('tbody');
  results.forEach((result, index) => {
    const row = createElement('tr');
    const rank = createElement('td');
    rank.append(createElement('span', 'rank', String(index + 1)));
    row.append(rank, createElement('td', '', String(result.moves)), createElement('td', '', formatDate(result.date)));
    body.append(row);
  });
  table.append(caption, head, body);
  return table;
}
