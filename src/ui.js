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

function createLink(text, href, className = '') {
  const link = createElement('a', className, text);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

export function createApp() {
  const app = createElement('div', 'app');
  const header = createElement('header', 'header');
  const brand = createElement('div', 'brand');
  const monogram = createElement('span', 'monogram', 'M');
  monogram.setAttribute('aria-hidden', 'true');
  brand.append(monogram, createElement('span', '', 'Memory'));
  const navigation = createElement('nav', 'navigation');
  navigation.setAttribute('aria-label', 'Game controls');
  navigation.append(
    createButton('New game', 'new-game', 'nav-button'),
    createButton('Leaderboard', 'leaderboard', 'nav-button'),
  );
  header.append(brand, navigation, createLink('GitHub ↗', 'https://github.com/advoryan/memory-game', 'source-link'));

  const main = createElement('main', 'main');
  const introduction = createElement('aside', 'introduction');
  introduction.append(createElement('p', 'eyebrow', 'Good memory.\nBrighter days.'));
  const playArea = createElement('section', 'play-area');
  playArea.setAttribute('aria-label', 'Memory game');
  const boardHeading = createElement('div', 'board-heading');
  boardHeading.append(createElement('span', 'eyebrow', 'The Pepe collection'), createElement('span', 'edition', '8 unique faces'));
  const board = createElement('div', 'board');
  board.setAttribute('aria-label', 'Sixteen cards, eight matching pairs');
  const hint = createElement('p', 'board-hint', 'Take your time. Find your pairs.');
  hint.setAttribute('role', 'status');
  playArea.append(boardHeading, board, hint);

  const sidebar = createElement('aside', 'sidebar');
  const title = createElement('h1', 'title', 'Small cards.\nBig focus.');
  const subtitle = createElement('p', 'subtitle', 'A familiar frog. A little presence of mind.');
  const stats = createElement('dl', 'stats');
  stats.setAttribute('aria-label', 'Game statistics');
  const counters = {};
  for (const [name, value] of [['Moves', '0'], ['Time', '00:00'], ['Pairs', '0/8']]) {
    const stat = createElement('div', 'stat');
    const counter = createElement('dd', '', value);
    stat.append(createElement('dt', '', name), counter);
    stats.append(stat);
    counters[name.toLowerCase()] = counter;
  }
  const progress = createElement('progress', 'progress');
  progress.max = 8;
  progress.value = 0;
  progress.setAttribute('aria-label', 'Matched pairs');
  const results = createElement('section', 'results');
  results.append(createElement('h2', 'results-title', 'Personal best'), createElement('p', 'empty-results', 'Your first good memory starts here.\nFinish a game to set your best.'));
  sidebar.append(title, subtitle, stats, progress, createButton('↻  New game', 'new-game', 'button button-primary'), results, createElement('p', 'eyebrow sidebar-note', 'A sharper you.\nOne pair at a time.'));
  main.append(introduction, playArea, sidebar);

  const footer = createElement('footer', 'footer');
  footer.append(createLink('RS SCHOOL', 'https://rs.school/'), createElement('span', '', 'MEMORY GAME / PEPE EDITION'), createElement('span', '', '2026'));
  app.append(header, main, footer);
  document.body.append(app);
  return { app, header, board, hint, counters, progress, results };
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
    const label = card.isOpen ? `${card.image} Pepe${card.isMatched ? ', matched' : ''}` : 'face down';
    button.setAttribute('aria-label', `Card ${card.id + 1}, ${label}`);
  }
  elements.counters.moves.textContent = state.moves;
  elements.counters.pairs.textContent = `${state.matchedPairs}/8`;
  elements.progress.value = state.matchedPairs;
  elements.hint.textContent = state.matchedPairs === 8
    ? 'Eight pairs. One happy memory.'
    : state.isLocked ? 'Not quite. Remember these two.' : 'Take your time. Find your pairs.';
}
