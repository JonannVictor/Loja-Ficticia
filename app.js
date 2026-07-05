const products = [
  {
    name: "Smartphone Aura X 256GB com camera tripla",
    category: "Celulares",
    oldPrice: "R$ 3.299,00",
    price: "R$ 2.699,00",
    installments: "10x de R$ 269,90 sem juros",
    tag: "18% off",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Notebook Velo 14 com SSD e tela antirreflexo",
    category: "Informatica",
    oldPrice: "R$ 4.199,00",
    price: "R$ 3.499,00",
    installments: "10x de R$ 349,90 sem juros",
    tag: "Oferta",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Sofa modular Linho 3 lugares com chaise",
    category: "Casa",
    oldPrice: "R$ 2.499,00",
    price: "R$ 1.899,00",
    installments: "10x de R$ 189,90 sem juros",
    tag: "24% off",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Smart TV Prisma 55 polegadas 4K Wi-Fi",
    category: "TV e Video",
    oldPrice: "R$ 3.899,00",
    price: "R$ 2.799,00",
    installments: "10x de R$ 279,90 sem juros",
    tag: "Top",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Cafeteira Essenza com jarra termica",
    category: "Casa",
    oldPrice: "R$ 529,00",
    price: "R$ 399,00",
    installments: "8x de R$ 49,88 sem juros",
    tag: "25% off",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Fone sem fio Pulse com cancelamento de ruido",
    category: "Informatica",
    oldPrice: "R$ 699,00",
    price: "R$ 459,00",
    installments: "6x de R$ 76,50 sem juros",
    tag: "Novo",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Guarda-roupa Aspen 6 portas com espelho",
    category: "Moveis",
    oldPrice: "R$ 1.799,00",
    price: "R$ 1.349,00",
    installments: "10x de R$ 134,90 sem juros",
    tag: "Casa",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Relogio fitness Track One resistente a agua",
    category: "Celulares",
    oldPrice: "R$ 499,00",
    price: "R$ 329,00",
    installments: "5x de R$ 65,80 sem juros",
    tag: "34% off",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
];

const grid = document.querySelector(".product-grid");
const cartCount = document.querySelector(".cart-count");
const filterButtons = document.querySelectorAll("[data-filter]");
const categoryLinks = document.querySelectorAll("[data-category]");
let cartItems = 0;

function productCard(product) {
  return `
    <article class="product-card" data-product-category="${product.category}">
      <figure>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
      </figure>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <span class="old-price">${product.oldPrice}</span>
        <span class="price">${product.price}</span>
        <span class="installments">${product.installments}</span>
        <button class="buy-button" type="button">
          <i data-lucide="shopping-bag"></i>
          Comprar
        </button>
      </div>
    </article>
  `;
}

function renderProducts(category = "Todos") {
  const visibleProducts = category === "Todos" || category === "Ofertas"
    ? products
    : products.filter((product) => product.category === category);

  renderProductList(visibleProducts);
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderProductList(productList) {
  grid.innerHTML = productList.map(productCard).join("");
  document.querySelectorAll(".buy-button").forEach((button) => {
    button.addEventListener("click", () => {
      cartItems += 1;
      cartCount.textContent = cartItems;
      button.textContent = "Adicionado";
      setTimeout(() => {
        button.innerHTML = '<i data-lucide="shopping-bag"></i> Comprar';
        refreshIcons();
      }, 1000);
    });
  });
  refreshIcons();
}

function setFilter(category) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === category || (category === "Ofertas" && button.dataset.filter === "Todos"));
  });
  renderProducts(category);
}

document.addEventListener("DOMContentLoaded", () => {
  refreshIcons();
  renderProducts();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => setFilter(link.dataset.category));
  });

  document.querySelector(".search").addEventListener("submit", (event) => {
    event.preventDefault();
    const term = document.querySelector("#search-input").value.trim().toLowerCase();
    const found = products.filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term));
    renderProductList(term ? found : products);
  });

  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(`#${button.dataset.modal}-modal`);
      if (modal) modal.showModal();
    });
  });
});
