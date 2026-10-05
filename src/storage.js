const storageKey = 'pepe-memory-results';
let sessionResults = [];
let storageAvailable = true;

export function getTopResults(results) {
  return [...results]
    .sort((first, second) => first.moves - second.moves || first.date - second.date)
    .slice(0, 10);
}

export function loadResults() {
  if (!storageAvailable) return sessionResults;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(stored)) return sessionResults;
    sessionResults = getTopResults(stored.filter((result) =>
      result && Number.isInteger(result.moves) && result.moves >= 8 &&
      Number.isFinite(result.date) && result.date > 0 &&
      !Number.isNaN(new Date(result.date).getTime()),
    ));
  } catch {
    storageAvailable = false;
    return sessionResults;
  }
  return sessionResults;
}

export function saveResult(moves) {
  sessionResults = getTopResults([...loadResults(), { moves, date: Date.now() }]);
  try {
    localStorage.setItem(storageKey, JSON.stringify(sessionResults));
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}
