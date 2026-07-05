import { campaigns, departments, products, promoMessages } from "./data/products.js";
import { readStorage, rememberList, writeStorage } from "./services/storage.js";
import { money, stars } from "./utils/format.js";

const state = {
  cart: readStorage("cart", []),
  favorites: readStorage("favorites", []),
  user: readStorage("user", null),
  location: readStorage("location", null),
  searches: readStorage("searches", []),
  viewed: readStorage("viewed", []),
  theme: readStorage("theme", "light"),
  lang: readStorage("lang", "pt"),
  filter: "Todos",
  hero: 0,
  checkout: 0,
};

const dictionary = {
  pt: {
    skip: "Pular para o conteudo",
    searchLabel: "Buscar produtos",
    searchPlaceholder: "O que voce procura hoje?",
    dark: "Dark",
    light: "Light",
    myCep: "Meu CEP",
    deliverTo: "Entregar em",
    login: "Entrar",
    favorites: "Favoritos",
    openCart: "Abrir carrinho",
    departments: "Departamentos",
    categories: "Categorias",
    home: "Inicio",
    searchShort: "Buscar",
    account: "Conta",
    all: "Todos",
    help: "Ajuda",
    support: "Central",
    deliveries: "Entregas",
    returns: "Trocas",
    partners: "Parceiros",
    sellWithUs: "Venda conosco",
    partnerArea: "Area do parceiro",
    about: "Sobre",
    terms: "Termos",
    privacy: "Privacidade",
    footerDisclaimer: "VivaMart e um projeto ficticio para demonstracao e portfolio. Nenhuma compra ou pagamento real e processado.",
    yourCart: "Seu carrinho",
    cepTitle: "Informe seu CEP",
    cepText: "Simulacao visual de regiao e frete.",
    cep: "CEP",
    apply: "Aplicar",
    accountWelcome: "Bem-vindo ao VivaMart",
    accountText: "Perfil demonstrativo salvo apenas localmente.",
    name: "Nome",
    continue: "Continuar",
    added: "Boa escolha! Produto adicionado ao carrinho.",
    removed: "Produto removido.",
    favOn: "Salvo nos seus favoritos.",
    favOff: "Produto removido dos favoritos.",
    noResults: "Nenhum produto encontrado",
    tryAgain: "Tente outra busca ou filtro.",
    seeProducts: "Ver produtos",
    add: "Adicionar",
    freeShipping: "Frete gratis demonstrativo",
    simulatedDelivery: "Entrega simulada por regiao",
    seeFull: "Ver vitrine completa",
    quickOffers: "Ofertas do dia",
    helloEyebrow: "Ola, vem comprar melhor",
    helloBack: "Bom te ver de novo",
    hello: "Ola! Que bom ter voce por aqui.",
    helloBackText: "Separamos algumas ofertas que combinam com suas ultimas visitas.",
    helloText: "Entre para salvar favoritos, acompanhar pedidos e receber ofertas relevantes.",
    updateProfile: "Atualizar perfil",
    loginCreate: "Entrar ou criar conta",
    readyHome: "Casa pronta",
    readyHomeText: "Moveis e decoracao com entrega combinada.",
    exploreHome: "Explorar Casa Viva",
    digitalUpgrade: "Upgrade digital",
    digitalText: "Setup rapido para estudo, trabalho e lazer.",
    seeTech: "Ver tecnologia",
    featured: "Produtos em destaque",
    showcase: "Vitrine VivaMart",
    seeAllProducts: "Ver todos os produtos",
    personalized: "Personalizado",
    maybeLike: "Talvez voce goste",
    recText: "Recomendacoes locais baseadas em visitas e buscas recentes.",
    flash: "Oferta Relampago",
    flashTitle: "Energia de oferta, compra sempre demonstrativa.",
    flashText: "Contador e estoque sao simulados.",
    soldDemo: "vendido demonstrativo",
    products: "Produtos",
    allProducts: "Todos os produtos",
    foundProducts: "produtos demonstrativos encontrados.",
    marketplace: "Marketplace",
    fullShowcase: "Vitrine completa",
    related: "Relacionados",
    relatedProducts: "Produtos relacionados",
    cartReview: "Revise sua compra",
    subtotal: "Subtotal",
    fakeSavings: "Economia ficticia",
    shipping: "Frete",
    total: "Total",
    coupon: "Cupom demonstrativo",
    applyCoupon: "Aplicar",
    checkout: "Continuar",
    emptyCartTitle: "Seu carrinho esta leve demais.",
    emptyCartText: "Que tal encontrar algo legal?",
    exploreOffers: "Explorar ofertas",
    favoritesTitle: "Seus favoritos",
    emptyFavTitle: "Voce ainda nao guardou nenhum queridinho.",
    emptyFavText: "Explore a VivaMart e salve produtos para encontrar depois.",
    checkoutDemo: "Checkout demonstrativo",
    demoAlert: "Ambiente demonstrativo - nenhum pagamento real sera processado.",
    back: "Voltar",
    confirmOrder: "Confirmar pedido ficticio",
    successEyebrow: "Pedido ficticio confirmado",
    successTitle: "Pedido confirmado. Agora e so aproveitar.",
    orderNumber: "Numero demonstrativo",
    searchResults: "Resultados para",
    productsFound: "produtos encontrados.",
    productsFoundTitle: "Produtos encontrados",
    suggestedCategories: "Categorias sugeridas",
    localHistory: "Historico local",
  },
  en: {
    skip: "Skip to content",
    searchLabel: "Search products",
    searchPlaceholder: "What are you looking for today?",
    dark: "Dark",
    light: "Light",
    myCep: "My ZIP",
    deliverTo: "Deliver to",
    login: "Sign in",
    favorites: "Favorites",
    openCart: "Open cart",
    departments: "Departments",
    categories: "Categories",
    home: "Home",
    searchShort: "Search",
    account: "Account",
    all: "All",
    help: "Help",
    support: "Support",
    deliveries: "Deliveries",
    returns: "Returns",
    partners: "Partners",
    sellWithUs: "Sell with us",
    partnerArea: "Partner area",
    about: "About",
    terms: "Terms",
    privacy: "Privacy",
    footerDisclaimer: "VivaMart is a fictional demo and portfolio project. No real purchases or payments are processed.",
    yourCart: "Your cart",
    cepTitle: "Enter your ZIP code",
    cepText: "Visual simulation for region and shipping.",
    cep: "ZIP",
    apply: "Apply",
    accountWelcome: "Welcome to VivaMart",
    accountText: "Demo profile saved locally only.",
    name: "Name",
    continue: "Continue",
    added: "Nice pick! Product added to cart.",
    removed: "Product removed.",
    favOn: "Saved to your favorites.",
    favOff: "Removed from favorites.",
    noResults: "No products found",
    tryAgain: "Try another search or filter.",
    seeProducts: "See products",
    add: "Add",
    freeShipping: "Demo free shipping",
    simulatedDelivery: "Shipping simulated by region",
    seeFull: "See full showcase",
    quickOffers: "Daily deals",
    helloEyebrow: "Hi, shop smarter",
    helloBack: "Good to see you again",
    hello: "Hi! Great to have you here.",
    helloBackText: "We picked offers that match your latest visits.",
    helloText: "Sign in to save favorites, track orders and receive relevant offers.",
    updateProfile: "Update profile",
    loginCreate: "Sign in or create account",
    readyHome: "Home ready",
    readyHomeText: "Furniture and decor with coordinated delivery.",
    exploreHome: "Explore Casa Viva",
    digitalUpgrade: "Digital upgrade",
    digitalText: "A faster setup for study, work and fun.",
    seeTech: "See technology",
    featured: "Featured products",
    showcase: "VivaMart showcase",
    seeAllProducts: "See all products",
    personalized: "Personalized",
    maybeLike: "You may like",
    recText: "Local recommendations based on visits and recent searches.",
    flash: "Flash Deal",
    flashTitle: "Deal energy, always a demo purchase.",
    flashText: "Timer and stock are simulated.",
    soldDemo: "sold demo",
    products: "Products",
    allProducts: "All products",
    foundProducts: "demo products found.",
    marketplace: "Marketplace",
    fullShowcase: "Full showcase",
    related: "Related",
    relatedProducts: "Related products",
    cartReview: "Review your cart",
    subtotal: "Subtotal",
    fakeSavings: "Demo savings",
    shipping: "Shipping",
    total: "Total",
    coupon: "Demo coupon",
    applyCoupon: "Apply",
    checkout: "Continue",
    emptyCartTitle: "Your cart is way too light.",
    emptyCartText: "How about finding something nice?",
    exploreOffers: "Explore deals",
    favoritesTitle: "Your favorites",
    emptyFavTitle: "You have not saved any favorites yet.",
    emptyFavText: "Explore VivaMart and save products to find later.",
    checkoutDemo: "Demo checkout",
    demoAlert: "Demo environment - no real payment will be processed.",
    back: "Back",
    confirmOrder: "Confirm fake order",
    successEyebrow: "Fake order confirmed",
    successTitle: "Order confirmed. Now just enjoy.",
    orderNumber: "Demo order number",
    searchResults: "Results for",
    productsFound: "products found.",
    productsFoundTitle: "Products found",
    suggestedCategories: "Suggested categories",
    localHistory: "Local history",
  },
};

const categoryLabels = {
  pt: { Celulares: "Celulares", Informatica: "Informatica", Casa: "Casa", Beleza: "Beleza", "TV e Video": "TV e Video", Games: "Games", Moveis: "Moveis", Decoracao: "Decoracao", Eletrodomesticos: "Eletrodomesticos", Moda: "Moda", Acessorios: "Acessorios", Automotivo: "Automotivo", Mercado: "Mercado", Utilidades: "Utilidades", Todos: "Todos", "Mais vendidos": "Mais vendidos", Ofertas: "Ofertas", Novidades: "Novidades" },
  en: { Celulares: "Phones", Informatica: "Computers", Casa: "Home", Beleza: "Beauty", "TV e Video": "TV & Video", Games: "Games", Moveis: "Furniture", Decoracao: "Decor", Eletrodomesticos: "Appliances", Moda: "Fashion", Acessorios: "Accessories", Automotivo: "Automotive", Mercado: "Grocery", Utilidades: "Utilities", Todos: "All", "Mais vendidos": "Best sellers", Ofertas: "Deals", Novidades: "New arrivals" },
};

const productNamesEn = {
  "aura-x-256": "Aura X 256GB smartphone with triple camera",
  "notebook-velo-14": "Velo 14 laptop with SSD and anti-glare display",
  "sofa-linho-chaise": "Linen modular 3-seat sofa with chaise",
  "smart-tv-prisma-55": "Prisma 55-inch 4K Wi-Fi Smart TV",
  "fone-pulse-anc": "Pulse wireless headphones with noise cancellation",
  "kit-beleza-luna": "Luna beauty kit with hair dryer and styling brush",
  "cafeteira-essenza": "Essenza coffee maker with thermal carafe",
  "relogio-track-one": "Track One waterproof fitness watch",
};

function t(key) {
  return dictionary[state.lang][key] || dictionary.pt[key] || key;
}

function cat(value) {
  return categoryLabels[state.lang][value] || value;
}

function productName(product) {
  return state.lang === "en" ? productNamesEn[product.id] || product.name : product.name;
}

function campaignText(campaign) {
  if (state.lang === "pt") return campaign;
  const items = {
    "Ofertas escolhidas para voce": {
      eyebrow: "Deals picked for you",
      title: "Shopping well makes the day lighter.",
      description: "Tech, home and everyday items in offers worth checking.",
      cta: "See deals",
      badge: "up to 35% off",
    },
    "Upgrade digital": {
      eyebrow: "Digital upgrade",
      title: "Technology that keeps up with your rhythm.",
      description: "Laptops, headphones and accessories for work, study and fun.",
      cta: "Explore technology",
      badge: "new cycle",
    },
    "Casa Viva": {
      eyebrow: "Casa Viva",
      title: "Small changes. A totally different home.",
      description: "Furniture, decor and appliances with your routine in mind.",
      cta: "Discover Casa Viva",
      badge: "home ready",
    },
  };
  return { ...campaign, ...(items[campaign.eyebrow] || {}) };
}

function promoText(index) {
  if (state.lang === "pt") return promoMessages[index];
  return [
    "Light shipping on orders over R$ 149",
    "New deals every day",
    "Protected purchase at VivaMart",
    "Easy installments on selected products",
  ][index];
}

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const view = $("[data-view]");
const header = $("[data-header]");
const cartCount = $("[data-cart-count]");
const searchInput = $("[data-search-input]");
const searchPanel = $("[data-search-panel]");
const overlay = $("[data-overlay]");
const cartDrawer = $("[data-cart-drawer]");
const menuDrawer = $("[data-menu-drawer]");
const cartContent = $("[data-cart-content]");
const toasts = $("[data-toasts]");

let heroTimer;
let promoTimer;
let flashTimer;
let searchCloseTimer;

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function save() {
  writeStorage("cart", state.cart);
  writeStorage("favorites", state.favorites);
  writeStorage("user", state.user);
  writeStorage("location", state.location);
  writeStorage("viewed", state.viewed);
  writeStorage("theme", state.theme);
  writeStorage("lang", state.lang);
}

function applyPreferences() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.lang === "en" ? "en" : "pt-BR";
  document.title = state.lang === "en" ? "VivaMart 2.0 | Demo marketplace" : "VivaMart 2.0";
  searchInput.placeholder = t("searchPlaceholder");
  $$("[data-theme-label]").forEach((node) => {
    node.textContent = state.theme === "dark" ? t("light") : t("dark");
  });
  $$("[data-lang-label]").forEach((node) => {
    node.textContent = state.lang === "en" ? "PT" : "EN";
  });
  $$("[data-toggle-theme]").forEach((button) => {
    button.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
    button.title = state.theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro";
  });
  $$("[data-toggle-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", state.lang === "en" ? "true" : "false");
    button.title = state.lang === "en" ? "Mudar para portugues" : "Change to English";
  });
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $$("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  $$(".department-nav a[href^='#/categoria/']").forEach((link) => {
    const category = decodeURIComponent(link.getAttribute("href").split("/")[2] || "");
    link.textContent = cat(category);
  });
}

function toast(message, icon = "check-circle") {
  const item = document.createElement("div");
  item.className = "toast";
  item.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
  toasts.append(item);
  icons();
  setTimeout(() => item.remove(), 3000);
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function updateChrome() {
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  $("[data-account-label]").textContent = state.user ? state.user.name.split(" ")[0] : t("login");
  $("[data-location-label]").textContent = state.location ? `${t("deliverTo")} ${state.location.city}` : t("myCep");
}

function refreshLanguage() {
  applyPreferences();
  renderMenus();
  renderCartDrawer();
  render();
}

function totals() {
  return state.cart.reduce((acc, item) => {
    const product = productById(item.id);
    if (!product) return acc;
    acc.subtotal += product.price * item.qty;
    acc.oldSubtotal += product.oldPrice * item.qty;
    return acc;
  }, { subtotal: 0, oldSubtotal: 0 });
}

function addCart(id, qty = 1) {
  const item = state.cart.find((entry) => entry.id === id);
  if (item) item.qty += qty;
  else state.cart.push({ id, qty });
  save();
  updateChrome();
  renderCartDrawer();
  cartCount.classList.remove("bump");
  requestAnimationFrame(() => cartCount.classList.add("bump"));
  toast(t("added"), "shopping-cart");
}

function setQty(id, qty) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  save();
  updateChrome();
  renderCartDrawer();
  if (location.hash === "#/carrinho") render();
}

function removeCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  save();
  updateChrome();
  renderCartDrawer();
  if (location.hash === "#/carrinho") render();
  toast(t("removed"), "trash-2");
}

function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
  save();
  syncFavorites();
  toast(state.favorites.includes(id) ? t("favOn") : t("favOff"), "heart");
}

function recordView(id) {
  state.viewed = [id, ...state.viewed.filter((item) => item !== id)].slice(0, 10);
  save();
}

function recommended() {
  if (!state.viewed.length && !state.searches.length) return products.filter((product) => product.isBestSeller).slice(0, 4);
  const cats = new Set(state.viewed.map(productById).filter(Boolean).map((product) => product.category));
  state.searches.forEach((term) => products.forEach((product) => {
    if (product.name.toLowerCase().includes(term.toLowerCase())) cats.add(product.category);
  }));
  return products
    .filter((product) => !state.viewed.includes(product.id))
    .sort((a, b) => (cats.has(b.category) ? 1 : 0) - (cats.has(a.category) ? 1 : 0) || b.discount - a.discount)
    .slice(0, 4);
}

function applyFilter(filter = "Todos") {
  state.filter = filter;
  if (filter === "Todos") return products;
  if (filter === "Mais vendidos") return products.filter((product) => product.isBestSeller);
  if (filter === "Ofertas") return products.filter((product) => product.discount >= 24);
  if (filter === "Novidades") return products.filter((product) => product.isNew);
  return products.filter((product) => product.category === filter || (filter === "Casa" && ["Moveis", "Eletrodomesticos"].includes(product.category)));
}

function filters(active = "Todos") {
  return `<div class="filter-pills">${["Todos", "Casa", "Informatica", "Celulares", "Mais vendidos", "Ofertas", "Novidades"].map((filter) => `<button class="${filter === active ? "active" : ""}" data-filter="${filter}">${cat(filter)}</button>`).join("")}</div>`;
}

function card(product) {
  const displayName = productName(product);
  return `
    <article class="product-card">
      <a href="#/produto/${product.id}">
        <figure>
          <img src="${product.image}" alt="${displayName}" loading="lazy">
          <span class="product-badges"><span class="badge">${product.discount}% off</span>${product.isNew ? `<span class="badge new">${cat("Novidades")}</span>` : ""}</span>
        </figure>
      </a>
      <button class="favorite-button" data-favorite="${product.id}" aria-label="${t("favorites")} ${displayName}"><i data-lucide="heart"></i></button>
      <div class="product-info">
        <span class="product-category">${cat(product.category)}</span>
        <a href="#/produto/${product.id}"><h3>${displayName}</h3></a>
        <div class="rating"><span>${stars(product.rating)}</span><small>${product.rating} (${product.reviews})</small></div>
        <div class="price-row"><span class="old-price">${money(product.oldPrice)}</span><span class="discount">-${product.discount}%</span></div>
        <span class="price">${money(product.price)}</span>
        <span class="installments">${product.installments}</span>
        <span class="${product.freeShipping ? "shipping-note" : "stock-note"}">${product.freeShipping ? t("freeShipping") : t("simulatedDelivery")}</span>
        <button class="buy-button" data-add-cart="${product.id}"><i data-lucide="shopping-bag"></i>${t("add")}</button>
      </div>
    </article>
  `;
}

function grid(list) {
  if (!list.length) return `<div class="empty-state"><i data-lucide="search-x"></i><h2>${t("noResults")}</h2><p class="muted">${t("tryAgain")}</p><a class="primary-link" href="#/produtos">${t("seeProducts")}</a></div>`;
  return `<section class="product-grid">${list.map(card).join("")}</section>`;
}

function heroBlock() {
  const campaign = campaignText(campaigns[state.hero]);
  return `
    <section class="hero">
      <div class="hero-copy" data-tone="${campaign.tone}">
        <p class="eyebrow">${campaign.eyebrow}</p>
        <h1>${campaign.title}</h1>
        <p>${campaign.description}</p>
        <div class="hero-actions"><a class="primary-link" href="#/categoria/${encodeURIComponent(campaign.filter)}">${campaign.cta}</a><a class="secondary-link" href="#/produtos">${t("seeFull")}</a></div>
      </div>
      <div class="hero-media"><img src="${campaign.image}" alt="${campaign.title}"><div class="deal-badge">${campaign.badge}</div></div>
    </section>
    <div class="hero-controls">
      <div class="carousel-dots">${campaigns.map((_, index) => `<button class="${index === state.hero ? "active" : ""}" data-hero-dot="${index}" aria-label="Campanha ${index + 1}"></button>`).join("")}</div>
      <div class="carousel-buttons"><button class="plain-icon" data-hero-prev><i data-lucide="chevron-left"></i></button><button class="plain-icon" data-hero-next><i data-lucide="chevron-right"></i></button></div>
    </div>
  `;
}

function home() {
  return `
    <section class="page">
      <div data-hero-shell>${heroBlock()}</div>
      <section class="quick-links">
        ${[["quickOffers", "badge-percent", "Ofertas"], ["Casa", "sofa", "Casa"], ["Informatica", "laptop", "Informatica"], ["Beleza", "sparkles", "Beleza"], ["Automotivo", "car", "Automotivo"], ["Mercado", "shopping-basket", "Mercado"]].map(([label, icon, filter]) => `<a class="quick-link" href="#/categoria/${encodeURIComponent(filter)}"><i data-lucide="${icon}"></i>${label === "quickOffers" ? t(label) : cat(label)}</a>`).join("")}
      </section>
      <section class="welcome-panel"><div><p class="eyebrow">${t("helloEyebrow")}</p><h2>${state.user ? `${t("helloBack")}, ${state.user.name}.` : t("hello")}</h2><p>${state.user ? t("helloBackText") : t("helloText")}</p></div><button class="primary-button" data-open-account>${state.user ? t("updateProfile") : t("loginCreate")}</button></section>
      <section class="promo-band">
        <article class="editorial-banner"><img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80" alt="Sala decorada"><div class="editorial-content"><span>${t("readyHome")}</span><strong>${t("readyHomeText")}</strong><a href="#/categoria/Casa">${t("exploreHome")}</a></div></article>
        <article class="editorial-banner"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" alt="Notebook"><div class="editorial-content"><span>${t("digitalUpgrade")}</span><strong>${t("digitalText")}</strong><a href="#/categoria/Informatica">${t("seeTech")}</a></div></article>
      </section>
      ${productSection(t("featured"), t("showcase"), applyFilter(state.filter), state.filter)}
      <div class="view-more"><a class="secondary-button" href="#/produtos">${t("seeAllProducts")}</a></div>
      <section><div class="section-title"><div><p class="eyebrow">${t("personalized")}</p><h2>${t("maybeLike")}</h2><p class="muted">${t("recText")}</p></div></div>${grid(recommended())}</section>
      ${flash()}
      ${benefits()}
    </section>
  `;
}

function productSection(title, eyebrow, list, active) {
  return `<section class="section-title"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>${filters(active)}</section>${grid(list)}`;
}

function flash() {
  return `<section class="flash-section"><div class="flash-head"><div><p class="eyebrow">${t("flash")}</p><h2>${t("flashTitle")}</h2><p class="muted">${t("flashText")}</p></div><div class="countdown" data-countdown><span>02h</span><span>18m</span><span>42s</span></div></div><div class="mini-product-row">${products.filter((p) => p.discount >= 25).slice(0, 3).map((p) => `<article class="flash-card"><img src="${p.image}" alt="${productName(p)}" loading="lazy"><div><strong>${productName(p)}</strong><p><span class="discount">${p.discount}% off</span> ${money(p.price)}</p><div class="stock-bar"><span style="width:${p.sold}%"></span></div><small>${p.sold}% ${t("soldDemo")}</small></div></article>`).join("")}</div></section>`;
}

function benefits() {
  const items = state.lang === "en"
    ? [["Flexible delivery", "Receive at home or use partner pickup points.", "truck"], ["Simple payment", "Pix, card and installments as visual demos.", "credit-card"], ["Protected purchase", "A visual flow from payment to delivery.", "shield-check"], ["Fast support", "Fictional digital support channels.", "message-circle"]]
    : [["Entrega flexivel", "Receba em casa ou retire em pontos parceiros.", "truck"], ["Pagamento simples", "Pix, cartao e parcelamento demonstrativos.", "credit-card"], ["Compra protegida", "Fluxo visual acompanhado ate a entrega.", "shield-check"], ["Atendimento rapido", "Canais digitais ficticios para suporte.", "message-circle"]];
  return `<section class="benefits">${items.map(([title, text, icon]) => `<article class="benefit-card"><i data-lucide="${icon}"></i><h3>${title}</h3><p>${text}</p><a href="#">${state.lang === "en" ? "Learn more" : "Saiba mais"}</a></article>`).join("")}</section>`;
}

function listPage(category = "Todos") {
  const list = applyFilter(category);
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">${t("products")}</p><h1>${category === "Todos" ? t("allProducts") : cat(category)}</h1><p class="muted">${list.length} ${t("foundProducts")}</p></div></div>${productSection(t("fullShowcase"), t("marketplace"), list, category)}</section>`;
}

function productPage(id) {
  const product = productById(id) || products[0];
  const displayName = productName(product);
  recordView(product.id);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return `<section class="page"><nav class="muted"><a href="#/">${t("home")}</a> / <a href="#/categoria/${encodeURIComponent(product.category)}">${cat(product.category)}</a> / ${displayName}</nav><section class="product-page"><div><div class="gallery"><div class="thumbs">${product.gallery.map((img, i) => `<button class="${i === 0 ? "active" : ""}" data-thumb="${img}"><img src="${img}" alt="${displayName} ${i + 1}"></button>`).join("")}</div><div class="main-image"><img data-main-image src="${product.image}" alt="${displayName}"></div></div><div class="info-tabs"><article class="details-box"><h2>${state.lang === "en" ? "About the product" : "Sobre o produto"}</h2><p>${state.lang === "en" ? "Fictional VivaMart product created to demonstrate a complete marketplace experience." : product.description}</p></article><article class="details-box"><h2>${state.lang === "en" ? "Features" : "Caracteristicas"}</h2><ul>${product.specs.map((s) => `<li>${state.lang === "en" ? "Demo product detail" : s}</li>`).join("")}</ul></article></div></div><aside class="buy-box"><span class="badge">${product.badge}</span><p class="product-category">${cat(product.category)}</p><h1 class="product-title">${displayName}</h1><div class="rating"><span>${stars(product.rating)}</span><small>${product.rating} (${product.reviews})</small></div><div class="price-row"><span class="old-price">${money(product.oldPrice)}</span><span class="discount">-${product.discount}%</span></div><div class="price">${money(product.price)}</div><p class="installments">${product.installments}</p><p class="stock-note">${state.lang === "en" ? "Fake stock" : "Estoque ficticio"}: ${product.stock}</p><h3>${state.lang === "en" ? "Variants" : "Variacoes"}</h3><div class="variant-row">${product.colors.map((color, i) => `<button class="${i === 0 ? "active" : ""}">${state.lang === "en" ? "Option" : color}</button>`).join("")}</div><h3>${state.lang === "en" ? "Quantity" : "Quantidade"}</h3><div class="stepper"><button data-product-dec>-</button><span data-product-qty>1</span><button data-product-inc>+</button></div><button class="primary-button" data-add-product="${product.id}">${state.lang === "en" ? "Add to cart" : "Adicionar ao carrinho"}</button><button class="buy-button" data-buy-now="${product.id}">${state.lang === "en" ? "Buy now" : "Comprar agora"}</button><button class="secondary-button" data-favorite="${product.id}"><i data-lucide="heart"></i>${t("favorites")}</button><div class="freight-box"><input placeholder="${state.lang === "en" ? "Simulate ZIP" : "Simular CEP"}"><button class="secondary-button" data-freight>${state.lang === "en" ? "Simulate" : "Simular"}</button></div><p class="muted">${state.lang === "en" ? "No real delivery estimate will be calculated." : "Nenhum prazo real sera calculado."}</p></aside></section><section><div class="section-title"><div><p class="eyebrow">${t("related")}</p><h2>${t("relatedProducts")}</h2></div></div>${grid(related.length ? related : recommended())}</section></section>`;
}

function cartLine(item) {
  const product = productById(item.id);
  return `<article class="cart-line"><img src="${product.image}" alt="${productName(product)}"><div><h3>${productName(product)}</h3><p class="muted">${cat(product.category)}</p><strong>${money(product.price)}</strong><div class="qty-row"><button data-qty-dec="${product.id}">-</button><span>${item.qty}</span><button data-qty-inc="${product.id}">+</button><button class="ghost-button" data-favorite="${product.id}">${t("favorites")}</button><button class="ghost-button" data-remove-cart="${product.id}">${state.lang === "en" ? "Remove" : "Remover"}</button></div></div></article>`;
}

function emptyCart() {
  return `<div class="empty-state"><i data-lucide="shopping-cart"></i><h2>${t("emptyCartTitle")}</h2><p class="muted">${t("emptyCartText")}</p><a class="primary-link" href="#/produtos">${t("exploreOffers")}</a></div>`;
}

function cartPage() {
  const t = totals();
  const shipping = t.subtotal > 149 || !t.subtotal ? 0 : 24.9;
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">${t("yourCart")}</p><h1>${t("cartReview")}</h1></div></div>${state.cart.length ? `<div class="cart-page"><div>${state.cart.map(cartLine).join("")}</div><aside class="summary-card"><h2>${state.lang === "en" ? "Summary" : "Resumo"}</h2><div class="coupon-row"><input placeholder="${t("coupon")}"><button class="secondary-button" data-coupon>${t("applyCoupon")}</button></div><div class="summary-row"><span>${t("subtotal")}</span><strong>${money(t.subtotal)}</strong></div><div class="summary-row"><span>${t("fakeSavings")}</span><strong>${money(t.oldSubtotal - t.subtotal)}</strong></div><div class="summary-row"><span>${t("shipping")}</span><strong>${shipping ? money(shipping) : "Gratis"}</strong></div><div class="summary-row"><span>${t("total")}</span><strong>${money(t.subtotal + shipping)}</strong></div><a class="primary-link" href="#/checkout">${t("checkout")}</a></aside></div><section><div class="section-title"><div><p class="eyebrow">Cross-sell</p><h2>${state.lang === "en" ? "People also viewed" : "Quem viu tambem gostou"}</h2></div></div>${grid(recommended())}</section>` : emptyCart()}</section>`;
}

function favoritesPage() {
  const list = state.favorites.map(productById).filter(Boolean);
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">${t("favorites")}</p><h1>${t("favoritesTitle")}</h1></div></div>${list.length ? grid(list) : `<div class="empty-state"><i data-lucide="heart"></i><h2>${t("emptyFavTitle")}</h2><p class="muted">${t("emptyFavText")}</p><a class="primary-link" href="#/produtos">VivaMart</a></div>`}</section>`;
}

function checkoutPage() {
  if (!state.cart.length) return cartPage();
  const steps = ["Identificacao", "Endereco", "Entrega", "Pagamento", "Revisao"];
  const forms = [
    `<div class="form-grid"><label>Nome<input value="${state.user?.name || ""}"></label><label>E-mail<input value="${state.user?.email || ""}"></label></div>`,
    `<div class="form-grid"><label>Endereco demonstrativo<input placeholder="Rua Exemplo, 123"></label><label>Cidade<input value="${state.location?.city || "Cidade simulada"}"></label></div>`,
    `<div class="form-grid"><label>Entrega<select><option>Entrega padrao simulada</option><option>Retirada ficticia</option></select></label></div>`,
    `<div class="form-grid"><label>Pagamento simulado<select><option>Pix demonstrativo</option><option>Cartao ficticio sem dados reais</option><option>Boleto visual</option></select></label></div>`,
    `<div>${state.cart.map(cartLine).join("")}</div>`,
  ];
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">${t("checkoutDemo")}</p><h1>${steps[state.checkout]}</h1></div></div><div class="checkout-layout"><section class="checkout-panel"><div class="progress">${steps.map((_, i) => `<span class="${i <= state.checkout ? "active" : ""}"></span>`).join("")}</div><div class="demo-alert">${t("demoAlert")}</div>${forms[state.checkout]}<div class="button-row"><button class="secondary-button" data-checkout-prev ${state.checkout === 0 ? "disabled" : ""}>${t("back")}</button><button class="primary-button" data-checkout-next>${state.checkout === 4 ? t("confirmOrder") : t("continue")}</button></div></section><aside class="summary-card">${summary()}</aside></div></section>`;
}

function summary() {
  const t = totals();
  const shipping = t.subtotal > 149 ? 0 : 24.9;
  return `<h2>${state.lang === "en" ? "Summary" : "Resumo"}</h2><div class="summary-row"><span>${t("products")}</span><strong>${money(t.subtotal)}</strong></div><div class="summary-row"><span>${t("shipping")}</span><strong>${shipping ? money(shipping) : "Gratis"}</strong></div><div class="summary-row"><span>${t("total")}</span><strong>${money(t.subtotal + shipping)}</strong></div>`;
}

function successPage() {
  return `<section class="page"><div class="success-card"><p class="eyebrow">${t("successEyebrow")}</p><h1>${t("successTitle")}</h1><p class="muted">${t("orderNumber")}: <strong>VM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}</strong></p><div class="timeline"><div><span>1</span><p>${state.lang === "en" ? "Order received in the demo environment." : "Pedido recebido no ambiente demonstrativo."}</p></div><div><span>2</span><p>${state.lang === "en" ? "Fake product preparation." : "Separacao ficticia dos produtos."}</p></div><div><span>3</span><p>${state.lang === "en" ? "Visual delivery estimate in 3 to 6 business days." : "Entrega visual estimada em 3 a 6 dias uteis."}</p></div></div><a class="primary-link" href="#/">${t("back")} VivaMart</a></div></section>`;
}

function renderSearch(term) {
  const lower = term.toLowerCase();
  const list = products.filter((p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
  view.innerHTML = `<section class="page"><div class="page-title"><div><p class="eyebrow">${t("searchShort")}</p><h1>${t("searchResults")} "${term}"</h1><p class="muted">${list.length} ${t("productsFound")}</p></div></div>${grid(list)}</section>`;
  bindDynamic();
  icons();
}

function render() {
  applyPreferences();
  const hash = location.hash || "#/";
  if (hash.startsWith("#/produto/")) view.innerHTML = productPage(decodeURIComponent(hash.split("/")[2]));
  else if (hash.startsWith("#/categoria/")) view.innerHTML = listPage(decodeURIComponent(hash.split("/")[2] || "Todos"));
  else if (hash.startsWith("#/busca/")) return renderSearch(decodeURIComponent(hash.split("/")[2] || ""));
  else if (hash === "#/produtos") view.innerHTML = listPage("Todos");
  else if (hash === "#/carrinho") view.innerHTML = cartPage();
  else if (hash === "#/favoritos") view.innerHTML = favoritesPage();
  else if (hash === "#/checkout") view.innerHTML = checkoutPage();
  else if (hash === "#/sucesso") view.innerHTML = successPage();
  else view.innerHTML = home();
  bindDynamic();
  updateChrome();
  syncFavorites();
  icons();
  view.focus({ preventScroll: true });
}

function renderCartDrawer() {
  const t = totals();
  cartContent.innerHTML = state.cart.length ? `${state.cart.map(cartLine).join("")}<div class="drawer-total"><span>${t("subtotal")}</span><strong>${money(t.subtotal)}</strong></div><div class="drawer-total"><span>${t("fakeSavings")}</span><strong>${money(t.oldSubtotal - t.subtotal)}</strong></div><a class="primary-link" data-close-drawers href="#/carrinho">${state.lang === "en" ? "Go to cart" : "Ir para o carrinho"}</a>` : emptyCart();
  icons();
}

function syncFavorites() {
  $$("[data-favorite]").forEach((button) => {
    button.classList.toggle("active", state.favorites.includes(button.dataset.favorite));
    button.setAttribute("aria-pressed", state.favorites.includes(button.dataset.favorite) ? "true" : "false");
  });
}

function renderMenus() {
  const deptTitles = state.lang === "en" ? { Tecnologia: "Technology", Casa: "Home", Estilo: "Style", Outros: "Other" } : {};
  const mega = `<div class="mega-grid">${departments.map((dept) => `<div class="mega-column"><h3><i data-lucide="${dept.icon}"></i>${deptTitles[dept.title] || dept.title}</h3>${dept.items.map((item) => `<a href="#/categoria/${encodeURIComponent(item)}">${cat(item)}</a>`).join("")}</div>`).join("")}</div>`;
  $("[data-mega-menu]").innerHTML = mega;
  $("[data-drawer-menu]").innerHTML = departments.map((dept) => `<section class="drawer-menu-section"><h3><i data-lucide="${dept.icon}"></i>${deptTitles[dept.title] || dept.title}</h3>${dept.items.map((item) => `<a data-close-drawers href="#/categoria/${encodeURIComponent(item)}">${cat(item)}</a>`).join("")}</section>`).join("");
}

function bindDynamic() {
  $$("[data-add-cart]").forEach((button) => button.addEventListener("click", () => addCart(button.dataset.addCart)));
  $$("[data-remove-cart]").forEach((button) => button.addEventListener("click", () => removeCart(button.dataset.removeCart)));
  $$("[data-qty-inc]").forEach((button) => button.addEventListener("click", () => {
    const item = state.cart.find((entry) => entry.id === button.dataset.qtyInc);
    setQty(button.dataset.qtyInc, (item?.qty || 1) + 1);
  }));
  $$("[data-qty-dec]").forEach((button) => button.addEventListener("click", () => {
    const item = state.cart.find((entry) => entry.id === button.dataset.qtyDec);
    setQty(button.dataset.qtyDec, (item?.qty || 1) - 1);
  }));
  $$("[data-favorite]").forEach((button) => button.addEventListener("click", (event) => {
    event.preventDefault();
    toggleFavorite(button.dataset.favorite);
  }));
  $$("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    if ((location.hash || "#/") === "#/") render();
    else location.hash = `#/categoria/${encodeURIComponent(state.filter)}`;
  }));
  $$("[data-thumb]").forEach((button) => button.addEventListener("click", () => {
    $("[data-main-image]").src = button.dataset.thumb;
    $$("[data-thumb]").forEach((thumb) => thumb.classList.remove("active"));
    button.classList.add("active");
  }));
  let qty = 1;
  $("[data-product-inc]")?.addEventListener("click", () => { qty += 1; $("[data-product-qty]").textContent = qty; });
  $("[data-product-dec]")?.addEventListener("click", () => { qty = Math.max(1, qty - 1); $("[data-product-qty]").textContent = qty; });
  $("[data-add-product]")?.addEventListener("click", (event) => addCart(event.currentTarget.dataset.addProduct, qty));
  $("[data-buy-now]")?.addEventListener("click", (event) => { addCart(event.currentTarget.dataset.buyNow, qty); location.hash = "#/checkout"; });
  $("[data-freight]")?.addEventListener("click", () => toast("Frete simulado para esta experiencia visual.", "truck"));
  $("[data-coupon]")?.addEventListener("click", () => toast("Cupom demonstrativo aplicado visualmente.", "ticket-percent"));
  $("[data-checkout-prev]")?.addEventListener("click", () => { state.checkout = Math.max(0, state.checkout - 1); render(); });
  $("[data-checkout-next]")?.addEventListener("click", () => {
    if (state.checkout < 4) { state.checkout += 1; render(); return; }
    state.cart = [];
    state.checkout = 0;
    save();
    location.hash = "#/sucesso";
  });
  bindHero();
  $$("[data-open-account]").forEach((button) => button.addEventListener("click", () => $("#account-modal").showModal()));
}

function bindHero() {
  $$("[data-hero-dot]").forEach((button) => button.addEventListener("click", () => { state.hero = Number(button.dataset.heroDot); updateHero(); startHero(); }));
  $("[data-hero-next]")?.addEventListener("click", () => moveHero(1));
  $("[data-hero-prev]")?.addEventListener("click", () => moveHero(-1));
}

function updateHero() {
  const shell = $("[data-hero-shell]");
  if (!shell || (location.hash || "#/") !== "#/") return;
  shell.innerHTML = heroBlock();
  bindHero();
  icons();
}

function moveHero(direction) {
  state.hero = (state.hero + direction + campaigns.length) % campaigns.length;
  updateHero();
  startHero();
}

function startHero() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (document.hidden) return;
    state.hero = (state.hero + 1) % campaigns.length;
    updateHero();
  }, 6500);
}

function startPromo() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let index = 0;
  clearInterval(promoTimer);
  const tick = () => {
    index = (index + 1) % promoMessages.length;
    $("[data-promo-message]").textContent = promoText(index);
  };
  $("[data-promo-message]").textContent = promoText(index);
  promoTimer = setInterval(tick, 3600);
}

function startCountdown() {
  let seconds = 2 * 3600 + 18 * 60 + 42;
  clearInterval(flashTimer);
  flashTimer = setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((value) => String(value).padStart(2, "0"));
    const node = $("[data-countdown]");
    if (node) node.innerHTML = `<span>${parts[0]}h</span><span>${parts[1]}m</span><span>${parts[2]}s</span>`;
  }, 1000);
}

function openDrawer(drawer) {
  closeDrawers();
  overlay.hidden = false;
  drawer.classList.add("open");
}

function closeDrawers() {
  overlay.hidden = true;
  cartDrawer.classList.remove("open");
  menuDrawer.classList.remove("open");
  $("[data-mega-menu]").hidden = true;
}

function bindSearch() {
  const form = $("[data-search-form]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (!term) return;
    state.searches = rememberList("searches", term);
    location.hash = `#/busca/${encodeURIComponent(term)}`;
    closeSearch();
  });
  searchInput.addEventListener("input", () => renderSearchPanel(searchInput.value.trim()));
  searchInput.addEventListener("focus", () => renderSearchPanel(searchInput.value.trim()));
  form.addEventListener("mouseenter", () => clearTimeout(searchCloseTimer));
  form.addEventListener("mouseleave", () => scheduleSearchClose());
  form.addEventListener("focusout", () => scheduleSearchClose(120));
  document.addEventListener("pointerdown", (event) => { if (!form.contains(event.target)) closeSearch(); });
  window.addEventListener("scroll", closeSearch, { passive: true });
}

function scheduleSearchClose(delay = 180) {
  clearTimeout(searchCloseTimer);
  searchCloseTimer = setTimeout(() => {
    if (!$("[data-search-form]").matches(":hover") && !document.activeElement?.hasAttribute("data-search-option")) closeSearch();
  }, delay);
}

function renderSearchPanel(term) {
  const lower = term.toLowerCase();
  const found = products.filter((p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)).slice(0, 5);
  const cats = [...new Set(products.map((p) => p.category).filter((cat) => cat.toLowerCase().includes(lower) || !term))].slice(0, 4);
  searchPanel.hidden = false;
  searchPanel.innerHTML = `<div class="search-section"><p class="search-title">${t("productsFoundTitle")}</p>${found.length ? found.map((p) => `<button class="search-item" data-search-option data-product="${p.id}"><img src="${p.image}" alt=""><span>${productName(p)}<br><small>${money(p.price)}</small></span><i data-lucide="arrow-up-right"></i></button>`).join("") : `<p class="muted">${t("noResults")}</p>`}</div><div class="search-section"><p class="search-title">${t("suggestedCategories")}</p>${cats.map((category) => `<button class="search-item" data-search-option data-category="${category}"><i data-lucide="tag"></i><span>${cat(category)}</span></button>`).join("")}</div>${state.searches.length ? `<div class="search-section"><p class="search-title">${t("localHistory")}</p>${state.searches.map((term) => `<button class="search-item" data-search-option data-term="${term}"><i data-lucide="clock"></i><span>${term}</span></button>`).join("")}</div>` : ""}`;
  $$("[data-product]", searchPanel).forEach((button) => button.addEventListener("click", () => { location.hash = `#/produto/${button.dataset.product}`; closeSearch(); }));
  $$("[data-category]", searchPanel).forEach((button) => button.addEventListener("click", () => { location.hash = `#/categoria/${encodeURIComponent(button.dataset.category)}`; closeSearch(); }));
  $$("[data-term]", searchPanel).forEach((button) => button.addEventListener("click", () => { searchInput.value = button.dataset.term; location.hash = `#/busca/${encodeURIComponent(button.dataset.term)}`; closeSearch(); }));
  icons();
}

function closeSearch() {
  clearTimeout(searchCloseTimer);
  searchPanel.hidden = true;
}

function bindStatic() {
  window.addEventListener("hashchange", render);
  window.addEventListener("scroll", () => header.classList.toggle("is-compact", scrollY > 24), { passive: true });
  $$("[data-open-cart]").forEach((button) => button.addEventListener("click", () => { renderCartDrawer(); openDrawer(cartDrawer); }));
  $$("[data-open-menu]").forEach((button) => button.addEventListener("click", () => {
    renderMenus();
    const desktop = button.classList.contains("dept-trigger") && matchMedia("(min-width: 981px)").matches;
    if (desktop) { const mega = $("[data-mega-menu]"); mega.hidden = !mega.hidden; return; }
    openDrawer(menuDrawer);
  }));
  $$("[data-open-account]").forEach((button) => button.addEventListener("click", () => $("#account-modal").showModal()));
  $$("[data-open-cep]").forEach((button) => button.addEventListener("click", () => $("#cep-modal").showModal()));
  $$("[data-toggle-theme]").forEach((button) => button.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    save();
    applyPreferences();
    icons();
  }));
  $$("[data-toggle-lang]").forEach((button) => button.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "pt" : "en";
    save();
    refreshLanguage();
    startPromo();
  }));
  overlay.addEventListener("click", closeDrawers);
  document.addEventListener("click", (event) => { if (event.target.closest("[data-close-drawers]")) closeDrawers(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeDrawers(); closeSearch(); } });
  header.addEventListener("mouseleave", () => { $("[data-mega-menu]").hidden = true; });
  bindSearch();
  bindForms();
}

function bindForms() {
  $("[data-account-form]").addEventListener("submit", (event) => {
    const data = new FormData(event.currentTarget);
    state.user = { name: data.get("name").toString(), email: data.get("email").toString() };
    save();
    updateChrome();
    toast(`Bom te ver por aqui, ${state.user.name}.`, "user-round-check");
    render();
  });
  $("[data-cep-form]").addEventListener("submit", (event) => {
    const data = new FormData(event.currentTarget);
    const cep = data.get("cep").toString().replace(/\D/g, "");
    if (cep.length !== 8) {
      event.preventDefault();
      $("[data-cep-error]").textContent = "Digite um CEP no formato 00000-000.";
      return;
    }
    state.location = { cep, city: Number(cep[0]) % 2 === 0 ? "Sao Paulo" : "Campinas" };
    save();
    updateChrome();
    toast("Regiao de entrega simulada aplicada.", "map-pin");
  });
}

function boot() {
  renderMenus();
  renderCartDrawer();
  bindStatic();
  updateChrome();
  render();
  startHero();
  startPromo();
  startCountdown();
  icons();
}

boot();
