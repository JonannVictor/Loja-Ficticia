export const departments = [
  { title: "Tecnologia", icon: "cpu", items: ["Celulares", "Informatica", "TV e Video", "Games"] },
  { title: "Casa", icon: "home", items: ["Casa", "Moveis", "Decoracao", "Eletrodomesticos"] },
  { title: "Estilo", icon: "sparkles", items: ["Beleza", "Moda", "Acessorios"] },
  { title: "Outros", icon: "package", items: ["Automotivo", "Mercado", "Utilidades"] },
];

export const promoMessages = [
  "Frete leve para compras acima de R$ 149",
  "Ofertas novas todos os dias",
  "Compra protegida na VivaMart",
  "Parcelamento facil em produtos selecionados",
];

export const campaigns = [
  {
    eyebrow: "Ofertas escolhidas para voce",
    title: "Comprar bem deixa o dia mais leve.",
    description: "Tecnologia, casa e utilidades em ofertas que valem a pena.",
    cta: "Ver ofertas",
    filter: "Ofertas",
    badge: "ate 35% off",
    tone: "teal",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1100&q=80",
  },
  {
    eyebrow: "Upgrade digital",
    title: "Tecnologia para acompanhar seu ritmo.",
    description: "Notebooks, fones e acessorios para trabalho, estudo e lazer.",
    cta: "Explorar tecnologia",
    filter: "Informatica",
    badge: "novo ciclo",
    tone: "blue",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80",
  },
  {
    eyebrow: "Casa Viva",
    title: "Pequenas mudancas. Uma casa diferente.",
    description: "Moveis, decoracao e eletros com a cara da sua rotina.",
    cta: "Descobrir Casa Viva",
    filter: "Casa",
    badge: "casa pronta",
    tone: "warm",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1100&q=80",
  },
];

export const products = [
  product("aura-x-256", "Smartphone Aura X 256GB com camera tripla", "Celulares", 2699, 3299, 4.8, 842, 18, "Oferta", true, true, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"),
  product("notebook-velo-14", "Notebook Velo 14 com SSD e tela antirreflexo", "Informatica", 3499, 4199, 4.7, 519, 17, "Mais vendido", false, true, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"),
  product("sofa-linho-chaise", "Sofa modular Linho 3 lugares com chaise", "Casa", 1899, 2499, 4.6, 231, 24, "Casa Viva", false, true, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"),
  product("smart-tv-prisma-55", "Smart TV Prisma 55 polegadas 4K Wi-Fi", "TV e Video", 2799, 3899, 4.9, 978, 28, "Top oferta", false, true, "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80"),
  product("fone-pulse-anc", "Fone sem fio Pulse com cancelamento de ruido", "Informatica", 459, 699, 4.7, 684, 34, "Novo", true, false, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"),
  product("kit-beleza-luna", "Kit beleza Luna com secador e escova modeladora", "Beleza", 279, 389, 4.6, 268, 28, "Novidade", true, false, "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=80"),
  product("cafeteira-essenza", "Cafeteira Essenza com jarra termica", "Casa", 399, 529, 4.5, 312, 25, "Oferta", true, false, "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80"),
  product("relogio-track-one", "Relogio fitness Track One resistente a agua", "Celulares", 329, 499, 4.5, 427, 34, "Mais leve", true, false, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"),
];

function product(id, name, category, price, oldPrice, rating, reviews, discount, badge, isNew, isBestSeller, image) {
  return {
    id,
    name,
    category,
    price,
    oldPrice,
    rating,
    reviews,
    discount,
    badge,
    isNew,
    isBestSeller,
    freeShipping: price > 450,
    stock: 12 + Math.floor(discount / 2),
    sold: 40 + discount,
    installments: `10x de R$ ${(price / 10).toFixed(2).replace(".", ",")} sem juros`,
    colors: ["Padrao", "Grafite", "Azul"],
    specs: ["Produto demonstrativo", "Garantia visual ficticia", "Entrega simulada", "Dados mockados"],
    description: "Produto ficticio da VivaMart criado para demonstrar uma experiencia completa de marketplace.",
    image,
    gallery: [image, image, image],
  };
}
