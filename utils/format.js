export function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function stars(rating) {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(full);
}

export function slugFromHash(hash) {
  return decodeURIComponent(hash.split("/")[1] || "");
}
