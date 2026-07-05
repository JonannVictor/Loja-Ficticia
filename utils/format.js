export function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function stars(rating) {
  const count = Math.round(rating);
  return "★★★★★".slice(0, count) + "☆☆☆☆☆".slice(count);
}
