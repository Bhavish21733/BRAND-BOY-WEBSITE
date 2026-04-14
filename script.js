/**
 * BRAND BOY — Homepage interactions
 * Cart: localStorage | Buy Now: WhatsApp
 */

const CART_KEY = "brandBoyCart";
const WHATSAPP = "918688641066";

function formatRupee(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (_) {}
  return [];
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartCount(items) {
  return items.reduce((s, i) => s + (i.qty || 1), 0);
}

function cartTotal(items) {
  return items.reduce((s, i) => s + Number(i.price) * (i.qty || 1), 0);
}

function whatsappBuyUrl(productName) {
  const text = `Hi BRAND BOY, I want to buy: ${productName}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove("is-visible");
  }, 2400);
}

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const toggle = document.getElementById("cart-toggle");
  const close = document.getElementById("cart-close");
  const backdrop = document.getElementById("cart-backdrop");
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkout = document.getElementById("cart-checkout");

  function renderCart() {
    const items = loadCart();
    const count = cartCount(items);
    if (countEl) countEl.textContent = String(count);
    if (totalEl) totalEl.textContent = formatRupee(cartTotal(items));
    if (checkout) checkout.disabled = items.length === 0;

    if (!itemsEl) return;
    if (!items.length) {
      itemsEl.innerHTML = '<p class="cart-drawer__empty">Your cart is empty. Add items from featured products.</p>';
      return;
    }
    itemsEl.innerHTML = items
      .map(
        (line, idx) => `
      <div class="cart-line" data-index="${idx}">
        <div></div>
        <div>
          <p class="cart-line__title">${escapeHtml(line.name)}</p>
          <p class="cart-line__meta">${formatRupee(line.price)} × ${line.qty || 1}</p>
        </div>
        <button type="button" class="cart-line__remove" data-remove="${idx}">Remove</button>
      </div>`
      )
      .join("");
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    toggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle?.addEventListener("click", () => {
    if (drawer?.hidden) openDrawer();
    else closeDrawer();
  });
  close?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  itemsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    const idx = Number(btn.getAttribute("data-remove"));
    const items = loadCart();
    items.splice(idx, 1);
    saveCart(items);
    renderCart();
    showToast("Item removed from cart");
  });

  checkout?.addEventListener("click", () => {
    const items = loadCart();
    if (!items.length) return;
    const lines = items.map((i) => `${i.name} (${formatRupee(i.price)} × ${i.qty || 1})`);
    const text = `Hi BRAND BOY, I want to checkout:\n${lines.join("\n")}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  window.addEventListener("brandboy:cart-updated", renderCart);
  renderCart();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function initSearch() {
  const form = document.querySelector(".search-form");
  const input = document.getElementById("site-search");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim().toLowerCase();
    const grid = document.getElementById("product-grid");
    const featured = document.getElementById("featured");
    if (featured) featured.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!grid) return;
    grid.querySelectorAll(".product-card").forEach((card) => {
      card.style.display = "";
    });
    let visible = 0;
    grid.querySelectorAll(".product-card").forEach((card) => {
      const title = card.querySelector(".product-card__title")?.textContent?.toLowerCase() || "";
      const show = !q || title.includes(q);
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    showToast(visible ? `Showing ${visible} product(s)` : "No matching products");
  });
}

function initCategoryFilter() {
  document.querySelectorAll(".category-card[data-category]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const cat = link.getAttribute("data-category");
      if (!cat) return;
      const grid = document.getElementById("product-grid");
      const featured = document.getElementById("featured");
      if (featured) {
        e.preventDefault();
        featured.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (!grid) return;
      let visible = 0;
      grid.querySelectorAll(".product-card").forEach((card) => {
        const c = card.getAttribute("data-category");
        const show = c === cat;
        card.style.display = show ? "" : "none";
        if (show) visible += 1;
      });
      const label = cat === "t-shirts" ? "T-Shirts" : cat.charAt(0).toUpperCase() + cat.slice(1);
      showToast(`${label}: ${visible} item(s)`);
    });
  });
}

function resetProductGrid() {
  document.querySelectorAll("#product-grid .product-card").forEach((card) => {
    card.style.display = "";
  });
}

function initNavReset() {
  document.querySelectorAll('a[href="#hero"]').forEach((a) => {
    a.addEventListener("click", resetProductGrid);
  });
}

function boot() {
  initYear();
  initCartDrawer();
  initProductActions();
  initSearch();
  initCategoryFilter();
  initNavReset();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
// LOAD ADMIN PRODUCTS WITHOUT REMOVING OLD ONES
function loadAdminProducts() {
    const products = JSON.parse(localStorage.getItem("brandBoyProducts")) || [];
    const productGrid = document.getElementById("product-grid");
  
    if (!productGrid) return;
  
    products.forEach((p) => {
      const productHTML = `
       <article class="product-card"
  data-product-id="${Date.now()}"
  data-name="${p.name}"
  data-price="${p.price}"
  data-category="${p.category?.toLowerCase() || 'other'}"
>
          <div class="product-card__media">
            <img src="${p.imageUrl}" alt="${p.name}">
          </div>
  
          <div class="product-card__body">
            <h3 class="product-card__title">${p.name}</h3>
  
            <div class="product-card__price-row">
              <span class="product-card__price">₹${p.price}</span>
            </div>
  
            <div class="product-card__actions">
              <button class="btn btn--outline btn--sm add-to-cart">Add to Cart</button>
              <button class="btn btn--primary btn--sm buy-now">Buy Now</button>
            </div>
          </div>
        </article>
      `;
  
      productGrid.innerHTML += productHTML;
    });
  }
  
  // CALL FUNCTION
  loadAdminProducts();
initProductActions();
  function initProductActions() {
    document.querySelectorAll(".product-card").forEach((card) => {
  
      const id = card.dataset.productId;
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const image = card.querySelector("img")?.src;
  
      const qtyInput = card.querySelector(".qty-input");
  
      // ADD TO CART
      card.querySelector(".add-to-cart")?.addEventListener("click", () => {
  
        let qty = qtyInput ? parseInt(qtyInput.value) : 1;
        if (isNaN(qty) || qty < 1) qty = 1;
  
        let items = JSON.parse(localStorage.getItem("brandBoyCart") || "[]");
  
        let existing = items.find(i => i.id === id);
  
        if (existing) {
          existing.qty += qty;
        } else {
          items.push({ id, name, price, qty });
        }
  
        localStorage.setItem("brandBoyCart", JSON.stringify(items));
  
        showToast("Added to cart");
        window.dispatchEvent(new Event("brandboy:cart-updated"));
      });
  
      // BUY NOW → WHATSAPP
      card.querySelector(".buy-now")?.addEventListener("click", () => {
  
        let qty = qtyInput ? parseInt(qtyInput.value) : 1;
        if (isNaN(qty) || qty < 1) qty = 1;
  
        const message =
  `🛍️ *BRAND BOY ORDER*
  
  ━━━━━━━━━━━━━━━
  👕 *Product:* ${name}
  💰 *Price:* ₹${price}
  📦 *Quantity:* ${qty}
  
  🖼️ *Product Image:*
  ${image}
  
  ━━━━━━━━━━━━━━━
  📍 *Customer Details:*
  Name:
  Address:
  
  ✅ Please confirm availability.`;
  
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
      });
  
    });
  }
  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
  
      const category = link.getAttribute('data-category');
  
      // REMOVE active from all
      document.querySelectorAll('.primary-nav__link').forEach(l => {
        l.classList.remove('active');
      });
  
      // ADD active to clicked
      link.classList.add('active');
  
      // scroll
      document.getElementById('featured').scrollIntoView({
        behavior: 'smooth'
      });
  
      // filter
      document.querySelectorAll('.product-card').forEach(card => {
        const cat = card.getAttribute('data-category');
  
        if (category === 'all' || cat === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  document.querySelectorAll('a[href="index.html"], a[href="#hero"]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
      });
    });
  });