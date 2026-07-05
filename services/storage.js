const prefix = "vivamart:";

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(prefix + key);
    return value ? JSON.parse(value) : fallback;
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
