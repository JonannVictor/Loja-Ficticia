import { campaigns, departments, products, promoMessages } from "./data/products.js";
import { readStorage, rememberList, writeStorage } from "./services/storage.js";
import { money, slugFromHash, stars } from "./utils/format.js";

const state = {
  cart: readStorage("cart", []),
  favorites: readStorage("favorites", []),
  user: readStorage("user", null),
  location: readStorage("location", null),
  recentSearches: readStorage("searches", []),
  viewed: readStorage("viewed", []),
  activeFilter: "Todos",
  heroIndex: 0,
  checkoutStep: 0,
};

const view = document.querySelector("[data-view]");
const header = document.querySelector("[data-header]");
const cartCount = document.querySelector("[data-cart-count]");
const promoMessage = document.querySelector("[data-promo-message]");
const promoStrip = document.querySelector("[data-promo-strip]");
const searchInput = document.querySelector("[data-search-input]");
const searchPanel = document.querySelector("[data-search-panel]");
const overlay = document.querySelector("[data-overlay]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const menuDrawer = document.querySelector("[data-menu-drawer]");
const filterDrawer = document.querySelector("[data-filter-drawer]");
const cartContent = document.querySelector("[data-cart-content]");
const drawerMenuContent = document.querySelector("[data-drawer-menu-content]");
const mobileFilters = document.querySelector("[data-mobile-filters]");
const toasts = document.querySelector("[data-toasts]");

let heroTimer;
let promoTimer;
let flashTimer;
let searchActiveIndex = -1;
let searchCloseTimer;

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function saveState() {
  writeStorage("cart", state.cart);
  writeStorage("favorites", state.favorites);
  writeStorage("user", state.user);
  writeStorage("location", state.location);
  writeStorage("viewed", state.viewed);
}

function toast(message, icon = "check-circle") {
  const item = document.createElement("div");
  item.className = "toast";
  item.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
  toasts.append(item);
  refreshIcons();
  setTimeout(() => item.remove(), 3200);
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function cartTotals() {
  return state.cart.reduce(
    (totals, item) => {
      const product = productById(item.id);
      if (!product) return totals;
      totals.subtotal += product.price * item.qty;
      totals.oldSubtotal += product.oldPrice * item.qty;
      return totals;
    },
    { subtotal: 0, oldSubtotal: 0 }
  );
}

function updateChrome() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;
  document.querySelector("[data-account-label]").textContent = state.user ? state.user.name.split(" ")[0] : "Entrar";
  document.querySelector("[data-location-label]").textContent = state.location
    ? `Entregar em ${state.location.city}`
    : "Meu CEP";
}

function bumpCart() {
  cartCount.classList.remove("bump");
  window.requestAnimationFrame(() => cartCount.classList.add("bump"));
}

function addToCart(id, qty = 1) {
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.qty += qty;
  else state.cart.push({ id, qty });
  saveState();
  updateChrome();
  renderCartDrawer();
  bumpCart();
  toast("Boa escolha! Produto adicionado ao carrinho.", "shopping-cart");
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveState();
  updateChrome();
  renderCartDrawer();
  toast("Produto removido.", "trash-2");
}

function setCartQty(id, qty) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveState();
  updateChrome();
  renderCartDrawer();
  if (location.hash === "#/carrinho") renderCartPage();
}

function toggleFavorite(id) {
  const exists = state.favorites.includes(id);
  state.favorites = exists ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
  saveState();
  renderFavoriteButtons();
  toast(exists ? "Produto removido dos favoritos." : "Salvo nos seus favoritos.", exists ? "heart-off" : "heart");
}

function recordVisit(product) {
  state.viewed = [product.id, ...state.viewed.filter((id) => id !== product.id)].slice(0, 10);
  saveState();
}

function recommendations() {
  if (!state.viewed.length && !state.recentSearches.length) {
    return products.filter((product) => product.isBestSeller).slice(0, 4);
  }
  const viewedProducts = state.viewed.map(productById).filter(Boolean);
  const categories = new Set(viewedProducts.map((product) => product.category));
  state.recentSearches.forEach((term) => {
    products.forEach((product) => {
      if (product.name.toLowerCase().includes(term.toLowerCase())) categories.add(product.category);
    });
  });
  const scored = products
    .filter((product) => !state.viewed.includes(product.id))
    .map((product) => ({
      product,
      score: (categories.has(product.category) ? 3 : 0) + (product.isBestSeller ? 1 : 0) + (product.isNew ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((item) => item.product);
}

function productCard(product) {
  return `
    <article class="product-card reveal" data-product-id="${product.id}">
      <a href="#/produto/${product.id}" aria-label="Abrir produto ${product.name}">
        <figure>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-badges">
            <span class="badge">${product.discount}% off</span>
            ${product.isNew ? '<span class="badge new">Novo</span>' : ""}
          </span>
        </figure>
      </a>
      <button class="favorite-button" type="button" data-favorite="${product.id}" aria-label="Favoritar ${product.name}">
        <i data-lucide="heart"></i>
      </button>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="#/produto/${product.id}"><h3>${product.name}</h3></a>
        <div class="rating" aria-label="Avaliacao ${product.rating}">
          <span>${stars(product.rating)}</span><small>${product.rating} (${product.reviews})</small>
        </div>
        <div class="price-row">
          <span class="old-price">${money(product.oldPrice)}</span>
          <span class="discount">-${product.discount}%</span>
        </div>
        <span class="price">${money(product.price)}</span>
        <span class="installments">${product.installments}</span>
        ${product.freeShipping ? '<span class="shipping-note">Frete gratis demonstrativo</span>' : '<span class="stock-note">Entrega simulada por regiao</span>'}
        <button class="buy-button" type="button" data-add-cart="${product.id}">
          <i data-lucide="shopping-bag"></i>
          Adicionar
        </button>
        <span class="quick-action">Clique no card para ver detalhes</span>
      </div>
    </article>
  `;
}

function productGrid(list) {
  if (!list.length) {
    return `
      <div class="empty-state">
        <i data-lucide="search-x"></i>
        <h2>Nenhum produto encontrado</h2>
        <p class="muted">Tente outro filtro ou explore as ofertas em destaque da VivaMart.</p>
        <a class="primary-link" href="#/produtos">Ver todos os produtos</a>
      </div>
    `;
  }
  return `<section class="product-grid" data-product-grid>${list.map(productCard).join("")}</section>`;
}

function filtersHtml(active = "Todos") {
  const filters = ["Todos", "Casa", "Informatica", "Celulares", "Mais vendidos", "Ofertas", "Novidades"];
  return `
    <div class="filter-pills" aria-label="Filtrar produtos">
      ${filters
        .map((filter) => `<button class="${filter === active ? "active" : ""}" type="button" data-filter="${filter}">${filter}</button>`)
        .join("")}
    </div>
  `;
}

function applyFilter(filter) {
  state.activeFilter = filter;
  if (filter === "Todos") return products;
  if (filter === "Mais vendidos") return products.filter((product) => product.isBestSeller);
  if (filter === "Ofertas") return products.filter((product) => product.discount >= 24);
  if (filter === "Novidades") return products.filter((product) => product.isNew);
  return products.filter((product) => product.category === filter || (filter === "Casa" && ["Moveis", "Eletrodomesticos"].includes(product.category)));
}

function homePage() {
  return `
    <section class="page">
      <div data-hero-shell>${heroBlock()}</div>
      ${quickLinks()}
      ${welcomePanel()}
      ${editorialBanners()}
      ${productSection("Produtos em destaque", "Vitrine VivaMart", applyFilter(state.activeFilter), state.activeFilter)}
      <div class="view-more"><a class="secondary-button" href="#/produtos">Ver todos os produtos</a></div>
      ${recommendationSection()}
      ${flashSection()}
      ${benefitsSection()}
    </section>
  `;
}

function heroBlock() {
  const campaign = campaigns[state.heroIndex];
  return `
    <section class="hero" data-hero>
      <div class="hero-copy" data-tone="${campaign.tone}">
        <p class="eyebrow">${campaign.eyebrow}</p>
        <h1>${campaign.title}</h1>
        <p>${campaign.description}</p>
        <div class="hero-actions">
          <a class="primary-link" href="#/categoria/${encodeURIComponent(campaign.filter)}">${campaign.cta}</a>
          <a class="secondary-link" href="#/produtos">Ver vitrine completa</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${campaign.image}" alt="${campaign.title}">
        <div class="deal-badge">${campaign.badge}</div>
      </div>
    </section>
    <div class="hero-controls">
      <div class="carousel-dots" aria-label="Campanhas">
        ${campaigns.map((_, index) => `<button type="button" class="${index === state.heroIndex ? "active" : ""}" data-hero-dot="${index}" aria-label="Campanha ${index + 1}"></button>`).join("")}
      </div>
      <div class="carousel-buttons">
        <button class="plain-icon" type="button" data-hero-prev aria-label="Campanha anterior"><i data-lucide="chevron-left"></i></button>
        <button class="plain-icon" type="button" data-hero-next aria-label="Proxima campanha"><i data-lucide="chevron-right"></i></button>
      </div>
    </div>
  `;
}

function quickLinks() {
  const links = [
    ["Ofertas do dia", "badge-percent", "Ofertas"],
    ["Casa", "sofa", "Casa"],
    ["Informatica", "laptop", "Informatica"],
    ["Beleza", "sparkles", "Beleza"],
    ["Automotivo", "car", "Automotivo"],
    ["Mercado", "shopping-basket", "Mercado"],
  ];
  return `
    <section class="quick-links" aria-label="Atalhos de compra">
      ${links
        .map(([label, icon, filter]) => `
          <a class="quick-link" href="#/categoria/${encodeURIComponent(filter)}">
            <i data-lucide="${icon}"></i>
            ${label}
          </a>
        `)
        .join("")}
    </section>
  `;
}

function welcomePanel() {
  const logged = Boolean(state.user);
  return `
    <section class="welcome-panel reveal">
      <div>
        <p class="eyebrow">Ola, vem comprar melhor</p>
        <h2>${logged ? `Bom te ver de novo, ${state.user.name}.` : "Ola! Que bom ter voce por aqui."}</h2>
        <p>${logged ? "Separamos algumas ofertas que combinam com suas ultimas visitas." : "Entre para salvar favoritos, acompanhar pedidos e receber ofertas mais relevantes."}</p>
      </div>
      <button class="primary-button" type="button" data-open-account>${logged ? "Atualizar perfil" : "Entrar ou criar conta"}</button>
    </section>
  `;
}

function editorialBanners() {
  return `
    <section class="promo-band" aria-label="Campanhas editoriais">
      <article class="editorial-banner">
        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80" alt="Sala decorada com poltrona">
        <div class="editorial-content">
          <span>Casa pronta</span>
          <strong>Moveis e decoracao com entrega combinada.</strong>
          <a href="#/categoria/Casa">Explorar Casa Viva</a>
        </div>
      </article>
      <article class="editorial-banner small">
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" alt="Notebook em uma mesa de trabalho">
        <div class="editorial-content">
          <span>Upgrade digital</span>
          <strong>Setup mais rapido para estudo, trabalho e lazer.</strong>
          <a href="#/categoria/Informatica">Ver tecnologia</a>
        </div>
      </article>
    </section>
  `;
}

function productSection(title, eyebrow, list, active) {
  return `
    <section class="section-title" id="products">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
      </div>
      ${filtersHtml(active)}
    </section>
    ${productGrid(list)}
  `;
}

function recommendationSection() {
  return `
    <section>
      <div class="section-title">
        <div>
          <p class="eyebrow">Personalizado</p>
          <h2>Talvez voce goste</h2>
          <p>Recomendacoes locais baseadas em visitas, categorias e buscas recentes.</p>
        </div>
      </div>
      ${productGrid(recommendations())}
    </section>
  `;
}

function flashSection() {
  const flashProducts = products.filter((product) => product.discount >= 25).slice(0, 3);
  return `
    <section class="flash-section reveal">
      <div class="flash-head">
        <div>
          <p class="eyebrow">Oferta Relampago</p>
          <h2>Energia de oferta, compra sempre demonstrativa.</h2>
          <p class="muted">Contador e estoque sao simulados para esta experiencia ficticia.</p>
        </div>
        <div class="countdown" data-countdown aria-label="Contador demonstrativo">
          <span>02h</span><span>18m</span><span>42s</span>
        </div>
      </div>
      <div class="mini-product-row">
        ${flashProducts
          .map((product) => `
            <article class="flash-card">
              <img src="${product.image}" alt="${product.name}" loading="lazy">
              <div>
                <strong>${product.name}</strong>
                <p><span class="discount">${product.discount}% off</span> ${money(product.price)}</p>
                <div class="stock-bar" aria-label="${product.sold}% vendido"><span style="width:${product.sold}%"></span></div>
                <small>${product.sold}% vendido demonstrativo</small>
              </div>
            </article>
          `)
          .join("")}
      </div>
    </section>
  `;
}

function benefitsSection() {
  const benefits = [
    ["Entrega flexivel", "Escolha receber em casa ou retirar em pontos parceiros.", "truck"],
    ["Pagamento simples", "Pix, cartao e parcelamento com resumo claro antes de fechar.", "credit-card"],
    ["Compra protegida", "Pedidos acompanhados do pagamento ate a entrega.", "shield-check"],
    ["Atendimento rapido", "Canais digitais para tirar duvidas sobre produtos e pedidos.", "message-circle"],
  ];
  return `
    <section class="benefits" id="benefits">
      ${benefits.map(([title, text, icon]) => `
        <article class="benefit-card">
          <i data-lucide="${icon}"></i>
          <h3>${title}</h3>
          <p>${text}</p>
          <a href="#">Saiba mais</a>
        </article>
      `).join("")}
    </section>
  `;
}

function productsPage(category = "Todos") {
  const list = applyFilter(category);
  return `
    <section class="page">
      <div class="page-title">
        <div>
          <p class="eyebrow">Produtos</p>
          <h1>${category === "Todos" ? "Todos os produtos" : category}</h1>
          <p>${list.length} produtos demonstrativos encontrados.</p>
        </div>
        <button class="secondary-button" type="button" data-open-filters><i data-lucide="sliders-horizontal"></i> Filtros</button>
      </div>
      ${productSection("Vitrine completa", "Marketplace", list, category)}
    </section>
  `;
}

function productPage(id) {
  const product = productById(id) || products[0];
  recordVisit(product);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return `
    <section class="page">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Inicio</a><span>/</span><a href="#/categoria/${encodeURIComponent(product.category)}">${product.category}</a><span>/</span><span>${product.name}</span>
      </nav>
      <section class="product-page">
        <div>
          <div class="gallery">
            <div class="thumbs">
              ${product.gallery.map((img, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-thumb="${img}"><img src="${img}" alt="${product.name} imagem ${index + 1}"></button>`).join("")}
            </div>
            <div class="main-image"><img src="${product.gallery[0]}" alt="${product.name}" data-main-image></div>
          </div>
          <div class="info-tabs">
            <article class="details-box">
              <h2>Sobre o produto</h2>
              <p>${product.description}</p>
            </article>
            <article class="details-box">
              <h2>Caracteristicas</h2>
              <ul class="spec-list">${product.specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>
            </article>
            <article class="details-box">
              <h2>Especificacoes</h2>
              <p>Marca: ${product.brand}</p>
              <p>Categoria: ${product.category}</p>
              <p>Estoque ficticio: ${product.stock} unidades demonstrativas.</p>
            </article>
            <article class="details-box">
              <h2>Avaliacoes demonstrativas</h2>
              <div class="rating"><span>${stars(product.rating)}</span><small>${product.rating} (${product.reviews})</small></div>
              <p>Dados ficticios usados apenas para compor a experiencia de produto.</p>
            </article>
          </div>
        </div>
        <aside class="buy-box">
          <span class="badge">${product.badge}</span>
          <p class="product-category">${product.category}</p>
          <h1 class="product-title">${product.name}</h1>
          <div class="rating"><span>${stars(product.rating)}</span><small>${product.rating} (${product.reviews} avaliacoes ficticias)</small></div>
          <div class="price-row"><span class="old-price">${money(product.oldPrice)}</span><span class="discount">-${product.discount}%</span></div>
          <div class="price">${money(product.price)}</div>
          <p class="installments">${product.installments}</p>
          <p class="stock-note">Estoque demonstrativo: ${product.stock} unidades.</p>
          <h3>Variacoes</h3>
          <div class="variant-row">${product.colors.map((color, index) => `<button type="button" class="${index === 0 ? "active" : ""}">${color}</button>`).join("")}</div>
          <h3>Quantidade</h3>
          <div class="stepper" data-product-stepper>
            <button type="button" data-product-dec>-</button><span data-product-qty>1</span><button type="button" data-product-inc>+</button>
          </div>
          <button class="primary-button" type="button" data-add-product="${product.id}">Adicionar ao carrinho</button>
          <button class="buy-button" type="button" data-buy-now="${product.id}">Comprar agora</button>
          <button class="secondary-button" type="button" data-favorite="${product.id}"><i data-lucide="heart"></i> Favoritar</button>
          <div class="freight-box">
            <input inputmode="numeric" placeholder="Simular CEP">
            <button class="secondary-button" type="button" data-freight>Simular</button>
          </div>
          <p class="muted">Simulador visual. Nenhum prazo real sera calculado.</p>
        </aside>
      </section>
      <section>
        <div class="section-title"><div><p class="eyebrow">Relacionados</p><h2>Produtos relacionados</h2></div></div>
        ${productGrid(related.length ? related : recommendations())}
      </section>
      <section>
        <div class="section-title"><div><p class="eyebrow">Historico local</p><h2>Vistos recentemente</h2></div></div>
        ${productGrid(state.viewed.map(productById).filter(Boolean).slice(0, 4))}
      </section>
    </section>
  `;
}

function cartPage() {
  const totals = cartTotals();
  const discount = Math.max(0, totals.oldSubtotal - totals.subtotal);
  const shipping = totals.subtotal > 149 || totals.subtotal === 0 ? 0 : 24.9;
  return `
    <section class="page">
      <div class="page-title"><div><p class="eyebrow">Carrinho</p><h1>Revise sua compra</h1></div></div>
      ${state.cart.length ? `
        <div class="cart-page">
          <div>${state.cart.map(cartLine).join("")}</div>
          <aside class="summary-card">
            <h2>Resumo</h2>
            <div class="coupon-row"><input placeholder="Cupom demonstrativo"><button class="secondary-button" type="button" data-coupon>Aplicar</button></div>
            <div class="freight-box"><input placeholder="CEP"><button class="secondary-button" type="button" data-freight>Simular</button></div>
            <div class="summary-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
            <div class="summary-row"><span>Economia ficticia</span><strong>${money(discount)}</strong></div>
            <div class="summary-row"><span>Frete demonstrativo</span><strong>${shipping ? money(shipping) : "Gratis"}</strong></div>
            <div class="summary-row"><span>Total</span><strong>${money(totals.subtotal + shipping)}</strong></div>
            <a class="primary-link" href="#/checkout">Continuar para checkout</a>
          </aside>
        </div>
        <section><div class="section-title"><div><p class="eyebrow">Cross-sell</p><h2>Quem levou produtos como esses tambem viu</h2></div></div>${productGrid(recommendations())}</section>
      ` : emptyCart()}
    </section>
  `;
}

function cartLine(item) {
  const product = productById(item.id);
  return `
    <article class="cart-line">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p class="muted">${product.category}</p>
        <strong>${money(product.price)}</strong>
        <div class="qty-row">
          <button type="button" data-qty-dec="${product.id}">-</button>
          <span>${item.qty}</span>
          <button type="button" data-qty-inc="${product.id}">+</button>
          <button class="ghost-button" type="button" data-favorite="${product.id}">Favoritar para depois</button>
          <button class="ghost-button" type="button" data-remove-cart="${product.id}">Remover</button>
        </div>
      </div>
    </article>
  `;
}

function emptyCart() {
  return `
    <div class="empty-state">
      <i data-lucide="shopping-cart"></i>
      <h2>Seu carrinho esta leve demais.</h2>
      <p class="muted">Que tal encontrar algo legal?</p>
      <a class="primary-link" href="#/produtos">Explorar ofertas</a>
    </div>
  `;
}

function favoritesPage() {
  const list = state.favorites.map(productById).filter(Boolean);
  return `
    <section class="page">
      <div class="page-title"><div><p class="eyebrow">Favoritos</p><h1>Seus favoritos</h1></div></div>
      ${list.length ? productGrid(list) : `
        <div class="empty-state">
          <i data-lucide="heart"></i>
          <h2>Voce ainda nao guardou nenhum queridinho.</h2>
          <p class="muted">Explore a VivaMart e salve produtos para encontrar depois.</p>
          <a class="primary-link" href="#/produtos">Explorar VivaMart</a>
        </div>
      `}
    </section>
  `;
}

function checkoutPage() {
  if (!state.cart.length) return cartPage();
  const steps = ["Identificacao", "Endereco", "Entrega", "Pagamento", "Revisao"];
  return `
    <section class="page">
      <div class="page-title"><div><p class="eyebrow">Checkout demonstrativo</p><h1>${steps[state.checkoutStep]}</h1></div></div>
      <div class="checkout-layout">
        <section class="checkout-panel">
          <div class="progress">${steps.map((_, index) => `<span class="${index <= state.checkoutStep ? "active" : ""}"></span>`).join("")}</div>
          <div class="demo-alert">Ambiente demonstrativo - nenhum pagamento real sera processado.</div>
          ${checkoutStepContent()}
          <div class="button-row">
            <button class="secondary-button" type="button" data-checkout-prev ${state.checkoutStep === 0 ? "disabled" : ""}>Voltar</button>
            <button class="primary-button" type="button" data-checkout-next>${state.checkoutStep === steps.length - 1 ? "Confirmar pedido ficticio" : "Continuar"}</button>
          </div>
        </section>
        <aside class="summary-card">${summaryHtml()}</aside>
      </div>
    </section>
  `;
}

function checkoutStepContent() {
  const forms = [
    `<div class="form-grid"><label>Nome<input value="${state.user?.name || ""}" placeholder="Nome demonstrativo"></label><label>E-mail<input value="${state.user?.email || ""}" placeholder="email@exemplo.com"></label></div>`,
    `<div class="form-grid"><label>Endereco demonstrativo<input placeholder="Rua Exemplo, 123"></label><label>Cidade<input value="${state.location?.city || "Cidade simulada"}"></label></div>`,
    `<div class="form-grid"><label>Entrega<select><option>Entrega padrao simulada</option><option>Retirada em ponto parceiro ficticio</option></select></label></div>`,
    `<div class="form-grid"><label>Pagamento simulado<select><option>Pix demonstrativo</option><option>Cartao ficticio sem dados reais</option><option>Boleto visual</option></select></label></div>`,
    `<div><p>Revise produtos, entrega e total. Esta compra nao sera processada.</p>${state.cart.map(cartLine).join("")}</div>`,
  ];
  return forms[state.checkoutStep];
}

function successPage() {
  const order = readStorage("lastOrder", null) || { code: "VM-2026-0001", items: state.cart };
  return `
    <section class="page">
      <div class="success-card">
        <p class="eyebrow">Pedido ficticio confirmado</p>
        <h1>Pedido confirmado. Agora e so aproveitar.</h1>
        <p class="muted">Numero demonstrativo do pedido: <strong>${order.code}</strong></p>
        <div class="timeline">
          <div><span>1</span><p>Pedido recebido no ambiente demonstrativo.</p></div>
          <div><span>2</span><p>Separacao ficticia dos produtos.</p></div>
          <div><span>3</span><p>Entrega visual estimada em 3 a 6 dias uteis.</p></div>
        </div>
        <a class="primary-link" href="#/">Voltar para a VivaMart</a>
      </div>
    </section>
  `;
}

function summaryHtml() {
  const totals = cartTotals();
  const shipping = totals.subtotal > 149 ? 0 : 24.9;
  return `
    <h2>Resumo</h2>
    <div class="summary-row"><span>Produtos</span><strong>${money(totals.subtotal)}</strong></div>
    <div class="summary-row"><span>Frete ficticio</span><strong>${shipping ? money(shipping) : "Gratis"}</strong></div>
    <div class="summary-row"><span>Total</span><strong>${money(totals.subtotal + shipping)}</strong></div>
  `;
}

function render() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/produto/")) view.innerHTML = productPage(slugFromHash(hash.replace("#/produto", "")));
  else if (hash.startsWith("#/categoria/")) view.innerHTML = productsPage(decodeURIComponent(hash.split("/")[2] || "Todos"));
  else if (hash.startsWith("#/busca/")) renderSearchResults(decodeURIComponent(hash.split("/")[2] || ""));
  else if (hash === "#/produtos") view.innerHTML = productsPage("Todos");
  else if (hash === "#/carrinho") view.innerHTML = cartPage();
  else if (hash === "#/favoritos") view.innerHTML = favoritesPage();
  else if (hash === "#/checkout") view.innerHTML = checkoutPage();
  else if (hash === "#/sucesso") view.innerHTML = successPage();
  else view.innerHTML = homePage();
  if (hash.startsWith("#/busca/")) return;
  bindDynamicEvents();
  updateChrome();
  renderFavoriteButtons();
  refreshIcons();
  view.focus({ preventScroll: true });
}

function renderCartPage() {
  view.innerHTML = cartPage();
  bindDynamicEvents();
  refreshIcons();
}

function renderCartDrawer() {
  const totals = cartTotals();
  cartContent.innerHTML = state.cart.length
    ? `
      ${state.cart.map(cartLine).join("")}
      <div class="drawer-total"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
      <div class="drawer-total"><span>Economia ficticia</span><strong>${money(Math.max(0, totals.oldSubtotal - totals.subtotal))}</strong></div>
      <a class="primary-link" href="#/carrinho" data-close-drawers>Ir para o carrinho</a>
    `
    : emptyCart();
  refreshIcons();
}

function renderMenus() {
  const menu = `
    <div class="mega-grid">
      ${departments.map((dept) => `
        <div class="mega-column">
          <h3><i data-lucide="${dept.icon}"></i>${dept.title}</h3>
          ${dept.items.map((item) => `<a href="#/categoria/${encodeURIComponent(item)}">${item}</a>`).join("")}
        </div>
      `).join("")}
    </div>
  `;
  document.querySelector("[data-mega-menu]").innerHTML = menu;
  drawerMenuContent.innerHTML = departments
    .map((dept) => `
      <section class="drawer-menu-section">
        <h3><i data-lucide="${dept.icon}"></i>${dept.title}</h3>
        ${dept.items.map((item) => `<a href="#/categoria/${encodeURIComponent(item)}" data-close-drawers>${item}</a>`).join("")}
      </section>
    `)
    .join("");
  mobileFilters.innerHTML = filtersHtml(state.activeFilter);
}

function renderFavoriteButtons() {
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.classList.toggle("active", state.favorites.includes(button.dataset.favorite));
    button.setAttribute("aria-pressed", state.favorites.includes(button.dataset.favorite) ? "true" : "false");
  });
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addCart));
  });
  document.querySelectorAll("[data-remove-cart]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.removeCart));
  });
  document.querySelectorAll("[data-qty-inc]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.cart.find((entry) => entry.id === button.dataset.qtyInc);
      setCartQty(button.dataset.qtyInc, (item?.qty || 1) + 1);
    });
  });
  document.querySelectorAll("[data-qty-dec]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.cart.find((entry) => entry.id === button.dataset.qtyDec);
      setCartQty(button.dataset.qtyDec, (item?.qty || 1) - 1);
    });
  });
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleFavorite(button.dataset.favorite);
    });
  });
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      if (location.hash === "#/" || location.hash === "") render();
      else location.hash = `#/categoria/${encodeURIComponent(state.activeFilter)}`;
      closeDrawers();
    });
  });
  document.querySelector("[data-open-filters]")?.addEventListener("click", () => {
    renderMenus();
    openDrawer(filterDrawer);
  });
  bindHeroEvents();
  bindProductPageEvents();
  bindCheckoutEvents();
  document.querySelectorAll("[data-freight]").forEach((button) => button.addEventListener("click", () => toast("Frete simulado para esta experiencia visual.", "truck")));
  document.querySelector("[data-coupon]")?.addEventListener("click", () => toast("Cupom demonstrativo aplicado visualmente.", "ticket-percent"));
}

function bindProductPageEvents() {
  let qty = 1;
  document.querySelectorAll("[data-thumb]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("[data-main-image]").src = button.dataset.thumb;
      document.querySelectorAll("[data-thumb]").forEach((thumb) => thumb.classList.remove("active"));
      button.classList.add("active");
    });
  });
  document.querySelector("[data-product-inc]")?.addEventListener("click", () => {
    qty += 1;
    document.querySelector("[data-product-qty]").textContent = qty;
  });
  document.querySelector("[data-product-dec]")?.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    document.querySelector("[data-product-qty]").textContent = qty;
  });
  document.querySelector("[data-add-product]")?.addEventListener("click", (event) => addToCart(event.currentTarget.dataset.addProduct, qty));
  document.querySelector("[data-buy-now]")?.addEventListener("click", (event) => {
    addToCart(event.currentTarget.dataset.buyNow, qty);
    location.hash = "#/checkout";
  });
}

function bindCheckoutEvents() {
  document.querySelector("[data-checkout-prev]")?.addEventListener("click", () => {
    state.checkoutStep = Math.max(0, state.checkoutStep - 1);
    render();
  });
  document.querySelector("[data-checkout-next]")?.addEventListener("click", () => {
    if (state.checkoutStep < 4) {
      state.checkoutStep += 1;
      render();
      return;
    }
    const order = {
      code: `VM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      items: state.cart,
      total: cartTotals().subtotal,
    };
    writeStorage("lastOrder", order);
    state.cart = [];
    state.checkoutStep = 0;
    saveState();
    location.hash = "#/sucesso";
  });
}

function isHomeRoute() {
  return (location.hash || "#/") === "#/";
}

function bindHeroEvents() {
  document.querySelectorAll("[data-hero-dot]").forEach((button) => {
    button.addEventListener("click", () => {
      state.heroIndex = Number(button.dataset.heroDot);
      updateHero();
      startHero();
    });
  });
  document.querySelector("[data-hero-next]")?.addEventListener("click", () => moveHero(1));
  document.querySelector("[data-hero-prev]")?.addEventListener("click", () => moveHero(-1));
}

function updateHero() {
  const shell = document.querySelector("[data-hero-shell]");
  if (!shell || !isHomeRoute()) return;
  shell.innerHTML = heroBlock();
  bindHeroEvents();
  refreshIcons();
}

function moveHero(direction) {
  state.heroIndex = (state.heroIndex + direction + campaigns.length) % campaigns.length;
  updateHero();
  startHero();
}

function startHero() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (document.hidden) return;
    state.heroIndex = (state.heroIndex + 1) % campaigns.length;
    if (isHomeRoute()) updateHero();
  }, 6500);
}

function startPromo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let index = 0;
  clearInterval(promoTimer);
  const tick = () => {
    index = (index + 1) % promoMessages.length;
    promoMessage.textContent = promoMessages[index];
  };
  promoTimer = setInterval(tick, 3600);
  promoStrip.addEventListener("mouseenter", () => clearInterval(promoTimer));
  promoStrip.addEventListener("mouseleave", () => {
    promoTimer = setInterval(tick, 3600);
  });
}

function startFlashCountdown() {
  clearInterval(flashTimer);
  let seconds = 2 * 3600 + 18 * 60 + 42;
  flashTimer = setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    document.querySelector("[data-countdown]")?.replaceChildren(...[`${h}h`, `${m}m`, `${s}s`].map((text) => {
      const span = document.createElement("span");
      span.textContent = text;
      return span;
    }));
  }, 1000);
}

function openDrawer(drawer) {
  closeDrawers();
  overlay.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  drawer.querySelector("button, a")?.focus();
}

function closeDrawers() {
  overlay.hidden = true;
  [cartDrawer, menuDrawer, filterDrawer].forEach((drawer) => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  });
  document.querySelector("[data-mega-menu]").hidden = true;
}

function bindStaticEvents() {
  window.addEventListener("hashchange", render);
  window.addEventListener("scroll", () => header.classList.toggle("is-compact", window.scrollY > 24), { passive: true });
  document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", () => {
    renderCartDrawer();
    openDrawer(cartDrawer);
  }));
  document.querySelectorAll("[data-open-menu]").forEach((button) => button.addEventListener("click", () => {
    renderMenus();
    const isDesktopDept = button.classList.contains("dept-trigger") && window.matchMedia("(min-width: 981px)").matches;
    if (isDesktopDept) {
      const mega = document.querySelector("[data-mega-menu]");
      mega.hidden = !mega.hidden;
      button.setAttribute("aria-expanded", mega.hidden ? "false" : "true");
      return;
    }
    openDrawer(menuDrawer);
  }));
  document.querySelectorAll("[data-open-account]").forEach((button) => button.addEventListener("click", () => document.querySelector("#account-modal").showModal()));
  document.querySelectorAll("[data-open-cep]").forEach((button) => button.addEventListener("click", () => document.querySelector("#cep-modal").showModal()));
  document.querySelectorAll("[data-close-drawers]").forEach((button) => button.addEventListener("click", closeDrawers));
  overlay.addEventListener("click", closeDrawers);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-drawers]")) closeDrawers();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawers();
      closeSearch();
    }
  });
  bindSearch();
  bindForms();
  const deptTrigger = document.querySelector(".dept-trigger");
  const mega = document.querySelector("[data-mega-menu]");
  deptTrigger.addEventListener("mouseenter", () => {
    renderMenus();
    mega.hidden = false;
  });
  header.addEventListener("mouseleave", () => {
    mega.hidden = true;
  });
}

function bindForms() {
  document.querySelector("[data-account-form]").addEventListener("submit", (event) => {
    const data = new FormData(event.currentTarget);
    state.user = { name: data.get("name").toString(), email: data.get("email").toString() };
    saveState();
    updateChrome();
    toast(`Bom te ver por aqui, ${state.user.name}.`, "user-round-check");
    render();
  });
  document.querySelector("[data-cep-form]").addEventListener("submit", (event) => {
    const data = new FormData(event.currentTarget);
    const cep = data.get("cep").toString().replace(/\D/g, "");
    const error = document.querySelector("[data-cep-error]");
    if (cep.length !== 8) {
      event.preventDefault();
      error.textContent = "Digite um CEP no formato 00000-000.";
      return;
    }
    state.location = { cep, city: Number(cep[0]) % 2 === 0 ? "Sao Paulo" : "Campinas" };
    saveState();
    updateChrome();
    toast("Regiao de entrega simulada aplicada.", "map-pin");
  });
}

function bindSearch() {
  const searchForm = document.querySelector("[data-search-form]");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (!term) return;
    state.recentSearches = rememberList("searches", term);
    location.hash = `#/busca/${encodeURIComponent(term)}`;
    renderSearchResults(term);
    closeSearch();
  });
  searchInput.addEventListener("input", () => renderSearchPanel(searchInput.value.trim()));
  searchInput.addEventListener("focus", () => renderSearchPanel(searchInput.value.trim()));
  searchForm.addEventListener("mouseenter", () => clearTimeout(searchCloseTimer));
  searchForm.addEventListener("mouseleave", () => scheduleSearchClose(180));
  searchForm.addEventListener("focusout", () => scheduleSearchClose(120));
  document.addEventListener("pointerdown", (event) => {
    if (!searchForm.contains(event.target)) closeSearch();
  });
  window.addEventListener("scroll", closeSearch, { passive: true });
  searchInput.addEventListener("keydown", (event) => {
    const options = [...searchPanel.querySelectorAll("[data-search-option]")];
    if (!options.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      searchActiveIndex = (searchActiveIndex + 1) % options.length;
      options[searchActiveIndex].focus();
    }
  });
}

function scheduleSearchClose(delay = 160) {
  clearTimeout(searchCloseTimer);
  searchCloseTimer = setTimeout(() => {
    const searchForm = document.querySelector("[data-search-form]");
    const focusIsOnOption = document.activeElement?.hasAttribute("data-search-option");
    if (!searchForm.matches(":hover") && !focusIsOnOption) {
      closeSearch();
    }
  }, delay);
}

function renderSearchPanel(term) {
  const lower = term.toLowerCase();
  const found = products
    .filter((product) => product.name.toLowerCase().includes(lower) || product.category.toLowerCase().includes(lower))
    .slice(0, 5);
  const categories = [...new Set(products.map((product) => product.category).filter((category) => category.toLowerCase().includes(lower) || !term))].slice(0, 4);
  searchPanel.hidden = false;
  searchInput.setAttribute("aria-expanded", "true");
  searchPanel.innerHTML = `
    <div class="search-section">
      <p class="search-title">Produtos encontrados</p>
      ${found.length ? found.map((product) => `
        <button class="search-item" type="button" data-search-option data-search-product="${product.id}">
          <img src="${product.image}" alt="">
          <span>${product.name}<br><small>${money(product.price)}</small></span>
          <i data-lucide="arrow-up-right"></i>
        </button>
      `).join("") : '<p class="muted">Nenhum resultado por enquanto.</p>'}
    </div>
    <div class="search-section">
      <p class="search-title">Categorias sugeridas</p>
      ${categories.map((category) => `<button class="search-item" type="button" data-search-option data-search-category="${category}"><i data-lucide="tag"></i><span>${category}</span></button>`).join("")}
    </div>
    ${state.recentSearches.length ? `<div class="search-section"><p class="search-title">Historico local</p>${state.recentSearches.map((item) => `<button class="search-item" type="button" data-search-option data-search-term="${item}"><i data-lucide="clock"></i><span>${item}</span></button>`).join("")}</div>` : ""}
  `;
  searchPanel.querySelectorAll("[data-search-product]").forEach((button) => button.addEventListener("click", () => {
    location.hash = `#/produto/${button.dataset.searchProduct}`;
    closeSearch();
  }));
  searchPanel.querySelectorAll("[data-search-category]").forEach((button) => button.addEventListener("click", () => {
    location.hash = `#/categoria/${encodeURIComponent(button.dataset.searchCategory)}`;
    closeSearch();
  }));
  searchPanel.querySelectorAll("[data-search-term]").forEach((button) => {
    button.addEventListener("click", () => {
      searchInput.value = button.dataset.searchTerm;
      renderSearchResults(button.dataset.searchTerm);
      closeSearch();
    });
  });
  refreshIcons();
}

function renderSearchResults(term) {
  const lower = term.toLowerCase();
  const list = products.filter((product) => product.name.toLowerCase().includes(lower) || product.category.toLowerCase().includes(lower));
  view.innerHTML = `
    <section class="page">
      <div class="page-title"><div><p class="eyebrow">Busca</p><h1>Resultados para "${term}"</h1><p>${list.length} produtos encontrados.</p></div></div>
      ${productGrid(list)}
    </section>
  `;
  bindDynamicEvents();
  refreshIcons();
}

function closeSearch() {
  clearTimeout(searchCloseTimer);
  searchPanel.hidden = true;
  searchInput.setAttribute("aria-expanded", "false");
  searchActiveIndex = -1;
}

function boot() {
  renderMenus();
  renderCartDrawer();
  bindStaticEvents();
  updateChrome();
  render();
  startHero();
  startPromo();
  startFlashCountdown();
  refreshIcons();
}

boot();
