const prefix = "vivamart:";

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}

export function rememberList(key, value, limit = 8) {
  const current = readStorage(key, []);
  const next = [value, ...current.filter((item) => item !== value)].slice(0, limit);
  writeStorage(key, next);
  return next;
}
